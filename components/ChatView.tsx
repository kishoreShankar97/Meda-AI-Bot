import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import * as api from '../services/apiService';
import { SendIcon, BotIcon, UserIcon, WarningIcon } from './icons';

interface ChatViewProps {
  onBack: () => void;
  onNewChatEntry: () => void;
}

const emergencyKeywords = ['chest pain', 'severe bleeding', 'unconscious', 'suicide', 'stroke', 'heart attack', 'cannot breathe'];

const ChatView: React.FC<ChatViewProps> = ({ onBack, onNewChatEntry }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmergencyBanner, setShowEmergencyBanner] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    // Initial bot message
    setMessages([
        {
            id: 'init',
            text: 'Hello! I am Meda AI Bot. How can I help you today? Please describe your symptoms.',
            sender: 'bot',
            timestamp: new Date().toISOString()
        }
    ]);
  }, []);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    // Emergency keyword check
    const lowerCaseInput = currentInput.toLowerCase();
    if (emergencyKeywords.some(keyword => lowerCaseInput.includes(keyword))) {
        setShowEmergencyBanner(true);
    } else {
        setShowEmergencyBanner(false);
    }

    try {
        const { response } = await api.postChatMessage(currentInput);
        const botMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: response,
            sender: 'bot',
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, botMessage]);
        onNewChatEntry(); // Signal to refresh history
    } catch (error) {
        const errorMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: 'Sorry, I could not connect to the server. Please try again later.',
            sender: 'bot',
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 animate-fade-in ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'bot' && <BotIcon />}
            <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-teal-500 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-bl-none'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
             {msg.sender === 'user' && <UserIcon />}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-end gap-2 justify-start">
             <BotIcon />
            <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-bl-none">
              <div className="flex items-center space-x-1">
                <span className="h-2 w-2 bg-teal-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                <span className="h-2 w-2 bg-teal-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                <span className="h-2 w-2 bg-teal-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

       {showEmergencyBanner && (
        <div className="p-4 bg-red-100 dark:bg-red-900/50 border-t-4 border-red-500 text-red-700 dark:text-red-300 animate-fade-in">
          <div className="flex">
            <div className="py-1"><WarningIcon /></div>
            <div>
              <p className="font-bold">Potential Emergency</p>
              <p className="text-sm">Your message may indicate a medical emergency. Please contact emergency services immediately.</p>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full p-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your symptoms..."
            className="flex-1 bg-transparent px-4 py-2 text-gray-800 dark:text-gray-200 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400"
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading || input.trim() === ''} className="p-2 rounded-full bg-teal-500 text-white disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors">
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;