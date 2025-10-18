import React from 'react';
import { User } from '../types';
import { UserIcon as AvatarIcon } from './icons'; // Re-using UserIcon as an avatar

interface ProfileViewProps {
  user: User;
  onBack: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onBack }) => {

    const handleEdit = () => {
        alert('Edit functionality is not yet implemented.');
    };

    return (
        <div className="p-6 h-full flex flex-col items-center bg-gray-50 dark:bg-gray-800">
            <div className="w-full max-w-sm bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-600 animate-fade-in">
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center mb-4 border-4 border-white dark:border-gray-700">
                        <AvatarIcon className="w-16 h-16 text-teal-500 dark:text-teal-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{user.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                
                <div className="mt-8 space-y-4 text-left">
                    <div>
                        <label className="text-sm font-semibold text-gray-500 dark:text-gray-400">Full Name</label>
                        <p className="text-gray-800 dark:text-gray-200">{user.name}</p>
                    </div>
                    <hr className="dark:border-gray-600"/>
                    <div>
                        <label className="text-sm font-semibold text-gray-500 dark:text-gray-400">Email Address</label>
                        <p className="text-gray-800 dark:text-gray-200">{user.email}</p>
                    </div>
                    <hr className="dark:border-gray-600"/>
                    <div>
                        <label className="text-sm font-semibold text-gray-500 dark:text-gray-400">Phone Number</label>
                        <p className="text-gray-800 dark:text-gray-200">{user.phone}</p>
                    </div>
                </div>

                <div className="mt-8">
                     <button 
                        onClick={handleEdit}
                        className="w-full py-2 px-4 font-semibold text-teal-600 dark:text-teal-300 bg-teal-100 dark:bg-teal-800/50 rounded-md hover:bg-teal-200 dark:hover:bg-teal-700/50 transition-colors"
                     >
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
