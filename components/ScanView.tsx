import React, { useState, useRef } from 'react';
import * as api from '../services/apiService';
import { UploadIcon, AlertIcon } from './icons';

interface ScanViewProps {
    onBack: () => void;
    onNewScanEntry: () => void;
}

const ScanView: React.FC<ScanViewProps> = ({ onBack, onNewScanEntry }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [consentGiven, setConsentGiven] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) { // 4MB limit
                setError('File is too large. Please select a file smaller than 4MB.');
                return;
            }
            setError('');
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setAnalysisResult('');
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;
        setIsLoading(true);
        setError('');
        setAnalysisResult('');
        try {
            const { analysis } = await api.postScan(selectedFile);
            setAnalysisResult(analysis);
            onNewScanEntry();
        } catch (err: any) {
            setError(err.message || 'An error occurred during analysis.');
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!consentGiven) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-white dark:bg-gray-800">
                <AlertIcon className="w-16 h-16 text-yellow-500 mb-4"/>
                <h2 className="text-2xl font-bold mb-2 dark:text-white">Privacy Consent</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">To analyze your medical document, the image will be securely uploaded for processing. It will not be stored long-term or used for any other purpose.</p>
                <button onClick={() => setConsentGiven(true)} className="w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 transition-colors">
                    I Understand and Consent
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 flex flex-col h-full dark:bg-gray-800">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-teal-500 dark:hover:border-teal-400 transition-colors" onClick={() => fileInputRef.current?.click()}>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <UploadIcon />
                <p className="mt-2 text-gray-600 dark:text-gray-300">Click to upload Prescription or X-Ray</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">PNG, JPG, WEBP up to 4MB</p>
            </div>

            {error && <p className="text-red-500 dark:text-red-400 mt-2 text-center">{error}</p>}

            {previewUrl && (
                <div className="mt-4 flex flex-col items-center">
                    <img src={previewUrl} alt="Preview" className="max-h-60 w-auto rounded-lg shadow-md" />
                    <button onClick={handleAnalyze} disabled={isLoading} className="mt-4 w-full bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors">
                        {isLoading ? 'Analyzing...' : 'Analyze Document'}
                    </button>
                </div>
            )}
            
            <div className="flex-1 mt-4 overflow-y-auto">
              {isLoading && (
                 <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
                </div>
              )}
              {analysisResult && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 animate-fade-in">
                      <h3 className="font-bold text-lg mb-2 dark:text-white">Analysis Result</h3>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{analysisResult}</p>
                  </div>
              )}
            </div>
        </div>
    );
};

export default ScanView;