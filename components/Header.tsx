
import React from 'react';
import { BackIcon, LogoIcon, MenuIcon } from './icons';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  onBack: () => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton, showMenuButton, onBack, onMenuClick }) => {
  return (
    <header className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-4 flex items-center shadow-md z-10 justify-between">
      <div className="flex items-center">
        {showMenuButton ? (
          <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-teal-600 transition-colors mr-2">
            <MenuIcon />
          </button>
        ) : showBackButton ? (
          <button onClick={onBack} className="p-2 rounded-full hover:bg-teal-600 transition-colors mr-2">
            <BackIcon />
          </button>
        ) : (
          <LogoIcon className="h-8 w-8 mr-3"/>
        )}
        <h1 className="text-xl font-bold truncate">{title}</h1>
      </div>
      {showMenuButton && (
        <div className="text-right text-xs hidden sm:block">
          <p className="font-semibold">Meda AI Bot</p>
          <p className="opacity-80">(Medical Expertise Diagnostic Agent)</p>
        </div>
      )}
    </header>
  );
};

export default Header;
