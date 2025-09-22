import React, { useState } from 'react';
import { GameState } from './types';
import CodeInput from './components/CodeInput';
import TypingGame from './components/TypingGame';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.NotStarted);
  const [sourceCode, setSourceCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('python');

  const handleStartGame = (code: string, lang: string) => {
    setSourceCode(code);
    setLanguage(lang);
    setGameState(GameState.InProgress);
  };

  const handleEndGame = () => {
    setGameState(GameState.Finished);
  };

  const handleResetGame = () => {
    setGameState(GameState.NotStarted);
    setSourceCode('');
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.InProgress:
      case GameState.Finished:
        return (
          <TypingGame
            code={sourceCode}
            language={language}
            onEnd={handleEndGame}
            onReset={handleResetGame}
            isFinished={gameState === GameState.Finished}
          />
        );
      case GameState.NotStarted:
      default:
        return <CodeInput onStart={handleStartGame} />;
    }
  };

  return (
    <div className="h-screen text-gray-100 flex flex-col items-center p-4 sm:p-6 md:p-8 overflow-hidden">
      <header className="w-full max-w-5xl mb-6 text-center flex-shrink-0">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-brand-purple to-brand-cyan text-transparent bg-clip-text">
          Code Typer Pro
        </h1>
        <p className="text-lg text-gray-400 mt-2">Hone your coding speed and accuracy.</p>
      </header>
      <main className="w-full max-w-5xl flex-grow min-h-0 flex flex-col">
        {renderContent()}
      </main>
      <footer className="w-full max-w-5xl mt-6 text-center text-gray-500 text-sm flex-shrink-0">
        <p>Built with React, TypeScript, and Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;