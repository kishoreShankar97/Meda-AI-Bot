import React, { useState, useEffect } from 'react';
import * as api from '../services/apiService';
import { LocationMarkerIcon } from './icons';
import { Doctor } from '../types';

interface DoctorsViewProps {
    onBack: () => void;
    onSelectDoctor: (doctor: Doctor) => void;
}

const specialties = ['All', 'General Physician', 'Dentist', 'Cardiologist', 'Dermatologist'];

const DoctorsView: React.FC<DoctorsViewProps> = ({ onBack, onSelectDoctor }) => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('All');

    const fetchDoctors = (latitude: number, longitude: number) => {
        setIsLoading(true);
        api.findNearbyDoctors(latitude, longitude)
            .then(({ doctors }) => {
                setDoctors(doctors);
                setFilteredDoctors(doctors);
            })
            .catch((err) => {
                setError(err.message || 'Failed to fetch doctor information from the server.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setError('');
                    fetchDoctors(position.coords.latitude, position.coords.longitude);
                },
                (err) => {
                    setError(`Location access denied: ${err.message}. Please enable it.`);
                    setIsLoading(false);
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedSpecialty === 'All') {
            setFilteredDoctors(doctors);
        } else {
            setFilteredDoctors(doctors.filter(d => d.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())));
        }
    }, [selectedSpecialty, doctors]);
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="text-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">Finding doctors near you...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center p-8 text-red-600 bg-red-50 dark:text-red-300 dark:bg-red-900/30 rounded-lg m-4">
                    <h3 className="font-bold">Error</h3>
                    <p>{error}</p>
                </div>
            );
        }
        
        return (
             <div className="space-y-4">
                {filteredDoctors.length > 0 ? filteredDoctors.map((doctor) => (
                    <button key={doctor.id} onClick={() => onSelectDoctor(doctor)} className="w-full text-left bg-white dark:bg-gray-700 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-600 animate-fade-in hover:bg-teal-50 dark:hover:bg-gray-600 hover:shadow-md transition-all">
                        <h3 className="font-bold text-lg text-teal-700 dark:text-teal-400 flex items-center">
                            <LocationMarkerIcon /> 
                            <span className="ml-2">{doctor.name}</span>
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 font-semibold text-sm mt-1">{doctor.specialty}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{doctor.address}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Phone: {doctor.phone}</p>
                    </button>
                )) : <p className="text-center text-gray-500 dark:text-gray-400 p-8">No doctors found for the selected specialty.</p>}
                 <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                    <p><strong>Disclaimer:</strong> This information is provided by AI and sourced from Google Maps. Please verify details before visiting.</p>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-800">
            <div className="p-2 bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-10">
                <div className="flex space-x-2 overflow-x-auto pb-2">
                    {specialties.map(s => (
                        <button key={s} onClick={() => setSelectedSpecialty(s)} className={`px-4 py-2 text-sm font-semibold rounded-full flex-shrink-0 transition-colors ${selectedSpecialty === s ? 'bg-teal-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                {renderContent()}
            </div>
        </div>
    );
};

export default DoctorsView;