import React from 'react';
import { AppView } from '../types';
import { EmergencyIcon } from './icons';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({ isOpen, onClose, onNavigate, onLogout, theme, setTheme }) => {
    const handleNavigation = (view: AppView) => {
        return (e: React.MouseEvent) => {
            e.preventDefault();
            onNavigate(view);
        }
    }
    
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    }

    const handleEmergencyCall = () => {
        window.location.href = 'tel:108';
    }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-20 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-800 shadow-xl z-30 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="p-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white flex justify-between items-center">
            <h2 className="text-xl font-bold">Menu</h2>
            <button onClick={onClose} className="p-1 text-2xl leading-none rounded-full hover:bg-white/20">&times;</button>
        </div>
        <nav className="p-4 flex-1">
          <ul className="space-y-2">
            <li><a href="#" onClick={handleNavigation(AppView.HOME)} className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors">Home</a></li>
            <li><a href="#" onClick={handleNavigation(AppView.PROFILE)} className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors">Profile</a></li>
            <li><a href="#" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors">About Us</a></li>
            <li><a href="#" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors">Help</a></li>
             <li><a href="#" onClick={onLogout} className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors">Logout</a></li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
             <div className="flex justify-between items-center mb-4">
                <label htmlFor="dark-mode-toggle" className="text-gray-700 dark:text-gray-300">Dark Mode</label>
                <button onClick={toggleTheme} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${theme === 'dark' ? 'bg-teal-500' : 'bg-gray-300'}`}>
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
             </div>
             <button 
                onClick={handleEmergencyCall}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
             >
                <EmergencyIcon />
                Emergency Call (108)
            </button>
        </div>
      </div>
    </>
  );
};

export default DrawerMenu;