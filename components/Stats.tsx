import React from 'react';

interface StatsProps {
  startTime: number;
  endTime: number;
  totalChars: number;
  errorCount: number;
  onReset: () => void;
}

const Stats: React.FC<StatsProps> = ({ startTime, endTime, totalChars, errorCount, onReset }) => {
  const durationInSeconds = (endTime - startTime) / 1000;
  const durationInMinutes = durationInSeconds / 60;
  
  // WPM is often calculated based on 5-character words
  const wpm = durationInMinutes > 0 ? Math.round((totalChars / 5) / durationInMinutes) : 0;
  
  const accuracy = totalChars > 0 ? Math.max(0, ((totalChars - errorCount) / totalChars) * 100).toFixed(2) : '100.00';

  return (
    <div className="bg-black/20 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg w-full mb-6 text-center">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-cyan text-transparent bg-clip-text mb-4">
        Results
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
          <p className="text-sm text-gray-400">WPM</p>
          <p className="text-3xl font-bold text-white">{wpm}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
          <p className="text-sm text-gray-400">Accuracy</p>
          <p className="text-3xl font-bold text-white">{accuracy}%</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
          <p className="text-sm text-gray-400">Errors</p>
          <p className="text-3xl font-bold text-white">{errorCount}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
          <p className="text-sm text-gray-400">Time</p>
          <p className="text-3xl font-bold text-white">{durationInSeconds.toFixed(2)}s</p>
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={onReset}
          className="bg-gradient-to-r from-brand-purple to-brand-cyan text-white font-bold py-3 px-8 rounded-full hover:shadow-glow-purple focus:outline-none focus:ring-4 focus:ring-brand-purple/50 transition-all transform hover:scale-105"
        >
          Try Another Snippet
        </button>
      </div>
    </div>
  );
};

export default Stats;