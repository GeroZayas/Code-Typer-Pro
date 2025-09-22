import React, { useState } from 'react';
import { SUPPORTED_LANGUAGES, DEFAULT_CODE } from '../constants';

interface CodeInputProps {
  onStart: (code: string, language: string) => void;
}

const CodeInput: React.FC<CodeInputProps> = ({ onStart }) => {
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  const [language, setLanguage] = useState<string>('python');
  const [error, setError] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCode(text);
        setError('');
      };
      reader.readAsText(file);
    }
  };
  
  const handleStart = () => {
    if (code.trim() === '') {
      setError('Code cannot be empty.');
      return;
    }
    onStart(code, language);
  }

  return (
    <div className="bg-black/20 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="language-select" className="block text-sm font-medium text-gray-300 mb-2">
            Language
          </label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-black/30 border border-white/20 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value} className="bg-gray-900">
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300 mb-2">
            Upload File
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-colors cursor-pointer"
          />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="code-textarea" className="block text-sm font-medium text-gray-300 mb-2">
          Or Paste Your Code
        </label>
        <textarea
          id="code-textarea"
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            if(error) setError('');
          }}
          placeholder="Paste your code here..."
          className="w-full h-64 font-mono bg-black/30 border border-white/20 text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all"
        />
      </div>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      <div className="mt-6 text-center">
        <button
          onClick={handleStart}
          className="bg-gradient-to-r from-brand-purple to-brand-cyan text-white font-bold py-3 px-8 rounded-full hover:shadow-glow-purple focus:outline-none focus:ring-4 focus:ring-brand-purple/50 transition-all transform hover:scale-105"
        >
          Start Typing
        </button>
      </div>
    </div>
  );
};

export default CodeInput;