import React, { useState } from 'react';
import { Doctor } from '../types';
import { LocationMarkerIcon } from './icons';

interface DoctorProfileViewProps {
  doctor: Doctor;
  onBack: () => void;
  onBookingConfirmed: (doctor: Doctor, slot: string) => void;
}

// Mock time slots for demonstration
const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '11:15 AM', '02:00 PM', '03:30 PM'];

const DoctorProfileView: React.FC<DoctorProfileViewProps> = ({ doctor, onBack, onBookingConfirmed }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const dates: Date[] = [];
  for(let i=0; i<5; i++){
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
  }

  const handleBookAppointment = async () => {
    if (selectedSlot) {
      setIsBooking(true);
      const formattedDate = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      // The onBookingConfirmed function is now an async API call
      await onBookingConfirmed(doctor, `${formattedDate} at ${selectedSlot}`);
      setIsBooking(false);
    }
  };


  return (
    <div className="p-4 h-full flex flex-col dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 mb-4">
          <h2 className="font-bold text-2xl text-teal-700 dark:text-teal-400">{doctor.name}</h2>
          <p className="text-gray-700 dark:text-gray-300 font-semibold text-md mt-1">{doctor.specialty}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 flex items-start"><LocationMarkerIcon className="flex-shrink-0 mr-2 mt-1"/> {doctor.address}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 ml-7">Phone: {doctor.phone}</p>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Select a Date</h3>
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
            {dates.map(date => (
                <button 
                  key={date.toISOString()} 
                  onClick={() => setSelectedDate(date)} 
                  className={`p-2 rounded-lg border-2 text-center flex-shrink-0 ${selectedDate.toDateString() === date.toDateString() ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/50 dark:border-teal-400' : 'border-gray-200 bg-white dark:bg-gray-700 dark:border-gray-600'}`}
                >
                    <div className="font-bold text-sm dark:text-gray-200">{date.toLocaleString('en-US', { weekday: 'short' })}</div>
                    <div className="text-2xl dark:text-gray-100">{date.getDate()}</div>
                </button>
            ))}
        </div>
        
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Select a Time</h3>
        <div className="grid grid-cols-3 gap-2">
            {timeSlots.map(slot => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3 rounded-lg font-semibold transition-colors ${selectedSlot === slot ? 'bg-teal-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                >
                    {slot}
                </button>
            ))}
        </div>
      </div>
      
      <div className="mt-auto pt-4">
          <button 
            onClick={handleBookAppointment}
            disabled={!selectedSlot || isBooking}
            className="w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors"
           >
              {isBooking ? 'Booking...' : 'Book Appointment'}
           </button>
      </div>
    </div>
  );
};

export default DoctorProfileView;