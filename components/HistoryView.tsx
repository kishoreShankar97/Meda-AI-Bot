import React from 'react';
import { HistoryItem, HistoryType } from '../types';
import { ChatIcon, ScanIcon, CalendarIcon, HistoryIcon as NoHistoryIcon, TrashIcon } from './icons';

interface HistoryViewProps {
  history: HistoryItem[];
  onBack: () => void;
  onDeleteItem: (id: string) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onBack, onDeleteItem }) => {

  const getIcon = (type: HistoryType) => {
      switch (type) {
          case HistoryType.CHAT:
              return <ChatIcon />;
          case HistoryType.SCAN:
              return <ScanIcon />;
          case HistoryType.APPOINTMENT:
              return <CalendarIcon />;
          default:
              return null;
      }
  }

  return (
    <div className="p-4 h-full bg-gray-50 dark:bg-gray-800">
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
          <NoHistoryIcon />
          <h2 className="text-xl font-bold mt-4">No History Yet</h2>
          <p>Your past chats, scans, and appointments will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div key={item._id} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-600 animate-fade-in">
              <div className="flex items-start justify-between">
                <div className="flex items-center mb-2">
                  <div className="text-teal-500">{getIcon(item.type)}</div>
                  <div className="ml-3">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200">{item.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(item.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <button onClick={() => onDeleteItem(item._id)} className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                    <TrashIcon />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-md whitespace-pre-wrap max-h-24 overflow-y-auto">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;