
import React from 'react';

const AuthLayout: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-br from-teal-400 to-cyan-600 text-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/10 rounded-full animate-bubble"
            style={{
              width: `${Math.random() * 80 + 20}px`,
              height: `${Math.random() * 80 + 20}px`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 15 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              bottom: '-100px',
            }}
          />
        ))}
      </div>
      <div className="relative z-10 w-full max-w-md p-8 space-y-8 bg-white/20 backdrop-blur-sm rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-white">{title}</h2>
        {children}
      </div>
      <style>{`
        @keyframes bubble {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-120vh) scale(1.5);
            opacity: 0;
          }
        }
        .animate-bubble {
          animation-name: bubble;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
