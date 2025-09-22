import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark as atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Stats from './Stats';

interface TypingGameProps {
  code: string;
  language: string;
  isFinished: boolean;
  onEnd: () => void;
  onReset: () => void;
}

const TypingGame: React.FC<TypingGameProps> = ({ code, language, onEnd, onReset, isFinished }) => {
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);


  const gameCode = useMemo(() => code.replace(/\r\n/g, '\n'), [code]);
  const lines = useMemo(() => gameCode.split('\n'), [gameCode]);

  const isTypingStarted = startTime !== null;

  useEffect(() => {
    if (!isFinished && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [isFinished]);

  useLayoutEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.scrollIntoView({ block: 'center', inline: 'nearest' });
    }
  }, [userInput]);

  useEffect(() => {
    if (userInput.length === gameCode.length && userInput === gameCode && !isFinished) {
      onEnd();
    }
  }, [userInput, gameCode, isFinished, onEnd]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isFinished) return;

    const value = e.target.value;
    if (!isTypingStarted) {
      setStartTime(Date.now());
    }

    if (value.length > userInput.length && value.slice(userInput.length) !== gameCode.slice(userInput.length, value.length)) {
       setErrorCount(prev => prev + (value.length - userInput.length));
    }

    setUserInput(value);
  };

  const handleAutocomplete = (mode: 'word' | 'line') => {
    if (isFinished || !inputRef.current) return;

    const cursorPosition = userInput.length;
    if (cursorPosition >= gameCode.length) return;

    let nextText = '';
    if (mode === 'word') {
      const remainingCode = gameCode.substring(cursorPosition);
      const match = remainingCode.match(/^(\s*\w+\W*)/);
      nextText = match ? match[1] : remainingCode.split(/\s/)[0] || remainingCode[0] || '';
    } else { // line
      const nextNewlineIndex = gameCode.indexOf('\n', cursorPosition);
      if (nextNewlineIndex !== -1) {
        nextText = gameCode.substring(cursorPosition, nextNewlineIndex + 1);
      } else {
        nextText = gameCode.substring(cursorPosition);
      }
    }

    if (nextText) {
      setUserInput(userInput + nextText);
    }
    inputRef.current.focus({ preventScroll: true });
  };

  let errorIndex = -1;
  for (let i = 0; i < userInput.length; i++) {
    if (userInput[i] !== gameCode[i]) {
      errorIndex = i;
      break;
    }
  }

  const correctPart = errorIndex === -1 ? userInput : userInput.substring(0, errorIndex);
  const incorrectPart = errorIndex === -1 ? '' : userInput.substring(errorIndex, userInput.length);
  
  const sharedMonoStyle: React.CSSProperties = useMemo(() => ({
    fontFamily: "'Fira Code', monospace",
    fontSize: '1rem',
    lineHeight: 1.7,
    margin: 0,
    whiteSpace: 'pre',
    backgroundColor: 'transparent',
    boxSizing: 'border-box',
    tabSize: 4,
    mozTabSize: 4,
  }), []);

  const sharedPaddingStyle: React.CSSProperties = useMemo(() => ({
    paddingTop: '1.25rem',
    paddingBottom: '1.25rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
  }), []);

  const codeLayerStyle: React.CSSProperties = useMemo(() => ({
    ...sharedMonoStyle,
    ...sharedPaddingStyle,
  }), [sharedMonoStyle, sharedPaddingStyle]);

  const syntaxHighlighterTheme = useMemo(() => {
    const theme = { ...atomOneDark };
    theme['pre[class*="language-"]'] = {
        ...codeLayerStyle,
        backgroundColor: 'transparent',
    };
    theme['code[class*="language-"]'] = {
        fontFamily: 'inherit',
        fontSize: 'inherit',
        lineHeight: 'inherit',
        backgroundColor: 'transparent',
    };
    // Disable italics for comments and other tokens to ensure consistent character width
    const noItalicStyle = { fontStyle: 'normal' };
    theme['comment'] = { ...theme['comment'], ...noItalicStyle };
    theme['prolog'] = { ...theme['prolog'], ...noItalicStyle };
    theme['doctype'] = { ...theme['doctype'], ...noItalicStyle };
    theme['cdata'] = { ...theme['cdata'], ...noItalicStyle };

    return theme;
  }, [codeLayerStyle]);

  return (
    <div className="w-full h-full flex flex-col">
      {isFinished && startTime && (
         <Stats
            startTime={startTime}
            endTime={Date.now()}
            totalChars={gameCode.length}
            errorCount={errorCount}
            onReset={onReset}
         />
      )}

      <div className="relative flex-grow min-h-0" onClick={() => !isFinished && inputRef.current?.focus({ preventScroll: true })}>
        {/* Single Scroll Container */}
        <div ref={scrollContainerRef} className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg h-full overflow-auto">
          <div className="flex">
            {/* Line Numbers */}
            <div className="text-right text-gray-500 select-none flex-shrink-0 sticky top-0 left-0 bg-black/20" style={{
              ...sharedMonoStyle,
              ...sharedPaddingStyle
            }}>
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Code Content Area */}
            <div className="relative flex-1">
               {/* Sizer Layer: Invisible, but establishes the height and width of the container */}
               <pre style={{ ...codeLayerStyle, visibility: 'hidden' }} aria-hidden="true">
                 <code>{gameCode + ' '}</code>
               </pre>

               {/* Input Textarea: Positioned correctly over the code area only, with matching styles. */}
               <textarea
                 ref={inputRef}
                 value={userInput}
                 onChange={handleChange}
                 className="absolute inset-0 w-full h-full z-10 resize-none border-none bg-transparent text-transparent focus:outline-none"
                 style={{
                   ...codeLayerStyle,
                   caretColor: 'transparent',
                 }}
                 autoCapitalize="off"
                 autoComplete="off"
                 autoCorrect="off"
                 spellCheck="false"
                 disabled={isFinished}
               />

               {/* Layer 1: Untyped code (greyed out) */}
               <pre style={codeLayerStyle} className="absolute inset-0 text-gray-600 pointer-events-none" aria-hidden="true">
                 <code>{gameCode}</code>
               </pre>
               
               {/* Layer 2: Correctly typed code (syntax highlighted) */}
               <div className="absolute inset-0 w-full h-full pointer-events-none">
                 <SyntaxHighlighter language={language} style={syntaxHighlighterTheme}>
                   {correctPart}
                 </SyntaxHighlighter>
               </div>

               {/* Layer 3: Error indicator and cursor */}
               <pre
                 className="absolute inset-0 w-full h-full select-none pointer-events-none"
                 style={codeLayerStyle}
                 aria-hidden="true"
               >
                 <code>
                   <span className="text-transparent">{correctPart}</span>
                   <span className="bg-red-500/30 text-transparent rounded-sm">{incorrectPart}</span>
                   {!isFinished && (
                     <span
                       ref={cursorRef}
                       className={`${
                         errorIndex === -1 ? 'bg-brand-purple' : 'bg-red-500'
                       } w-[2px] h-[1.2em] inline-block align-text-bottom animate-pulse rounded-[1px]`}
                     ></span>
                   )}
                 </code>
               </pre>
             </div>
          </div>
        </div>
      </div>
      
      {!isFinished && (
        <div className="mt-4 flex items-center justify-center space-x-4 flex-shrink-0">
          <button 
            onClick={() => handleAutocomplete('word')}
            className="bg-white/10 text-gray-300 py-2 px-5 rounded-lg hover:bg-white/20 border border-white/20 transition-colors"
          >
            Autocomplete Word
          </button>
           <button 
            onClick={() => handleAutocomplete('line')}
            className="bg-white/10 text-gray-300 py-2 px-5 rounded-lg hover:bg-white/20 border border-white/20 transition-colors"
          >
            Autocomplete Line
          </button>
          <button 
            onClick={onReset}
            className="bg-red-500/50 text-white py-2 px-5 rounded-lg hover:bg-red-500/80 border border-red-400/50 transition-colors"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default TypingGame;