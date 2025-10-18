
import React from 'react';
import { LogoIcon } from './icons';

const SplashScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-br from-teal-400 to-cyan-600 text-white">
      <div className="animate-fade-in-scale">
        <LogoIcon className="h-24 w-24 mb-4" />
      </div>
      <h1 className="text-4xl font-bold animate-fade-in" style={{ animationDelay: '300ms' }}>
        Meda AI Bot
      </h1>
      <p className="text-lg mt-2 opacity-0 animate-fade-in" style={{ animationDelay: '600ms' }}>
        Medical Expertise Diagnostic Agent
      </p>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 900ms ease-out forwards;
        }
        .animate-fade-in-scale {
            animation: fadeInScale 900ms ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
