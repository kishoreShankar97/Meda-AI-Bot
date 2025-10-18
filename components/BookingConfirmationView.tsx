import React from 'react';
import { Doctor } from '../types';

interface BookingConfirmationViewProps {
  booking: {
    doctor: Doctor;
    slot: string;
  };
  onDone: () => void;
}

const CheckmarkIcon: React.FC = () => (
    <svg className="w-24 h-24 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
);


const BookingConfirmationView: React.FC<BookingConfirmationViewProps> = ({ booking, onDone }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-white dark:bg-gray-800 animate-fade-in">
        <div className="animate-fade-in-scale">
            <CheckmarkIcon />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mt-4">Appointment Confirmed!</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Your appointment has been successfully booked.</p>

        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 w-full mt-8 text-left">
            <h3 className="font-bold text-lg text-teal-700 dark:text-teal-400">{booking.doctor.name}</h3>
            <p className="text-gray-700 dark:text-gray-300">{booking.doctor.specialty}</p>
            <p className="text-gray-600 dark:text-gray-300 mt-2 font-semibold">{booking.slot}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{booking.doctor.address}</p>
        </div>

        <button onClick={onDone} className="mt-8 w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 transition-colors">
            Done
        </button>
    </div>
  );
};

export default BookingConfirmationView;