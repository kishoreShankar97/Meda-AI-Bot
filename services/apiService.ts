import { User, HistoryItem, Doctor } from '../types';

// Replace with your actual backend URL in a real deployment
const BASE_URL = 'http://localhost:3001/api'; 
const TOKEN_KEY = 'meda-ai-token';

export const setToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
};

const getAuthHeaders = () => {
    const token = getToken();
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};

const handleResponse = async (response: Response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'An unknown error occurred.');
    }
    return data;
};

// --- AUTH ---
export const login = async (phone: string, password: string): Promise<{ user: User, token: string }> => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
    });
    return handleResponse(response);
};

export const signup = async (userData: Omit<User, 'token'> & { password?: string }): Promise<{ user: User, token: string }> => {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    return handleResponse(response);
};

// --- USER DATA ---
export const getProfile = async (): Promise<{ user: User }> => {
    const response = await fetch(`${BASE_URL}/user/profile`, {
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

export const getHistory = async (): Promise<{ history: HistoryItem[] }> => {
    const response = await fetch(`${BASE_URL}/user/history`, {
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

export const deleteHistoryItem = async (id: string): Promise<{ success: boolean }> => {
    const response = await fetch(`${BASE_URL}/user/history/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

export const bookAppointment = async (bookingData: { doctor: Doctor, slot: string }): Promise<HistoryItem> => {
    const response = await fetch(`${BASE_URL}/user/appointments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(bookingData),
    });
    return handleResponse(response);
}

// --- AI SERVICES ---
export const postChatMessage = async (prompt: string): Promise<{ response: string }> => {
    const response = await fetch(`${BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ prompt }),
    });
    return handleResponse(response);
};

export const postScan = async (imageFile: File): Promise<{ analysis: string }> => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${BASE_URL}/ai/scan`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` }, // FormData sets its own Content-Type
        body: formData,
    });
    return handleResponse(response);
};

export const findNearbyDoctors = async (latitude: number, longitude: number): Promise<{ doctors: Doctor[] }> => {
    const response = await fetch(`${BASE_URL}/ai/doctors-nearby`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ latitude, longitude }),
    });
    return handleResponse(response);
};
