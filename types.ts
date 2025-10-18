export enum AppView {
    SPLASH = 'Splash',
    LOGIN = 'Login',
    SIGNUP = 'Signup',
    WELCOME = 'Welcome',
    HOME = 'Home',
    CHAT = 'Chat',
    SCAN = 'Scan',
    DOCTORS = 'Doctors',
    HISTORY = 'History',
    PROFILE = 'Profile',
    DOCTOR_PROFILE = 'Doctor Profile',
    BOOKING_CONFIRMATION = 'Booking Confirmation',
}

export interface User {
    name: string;
    phone: string;
    email: string;
    token?: string;
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: string;
}

export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    address: string;
    phone?: string;
    distance?: string;
    uri?: string;
}

export enum HistoryType {
    CHAT = 'Chat',
    SCAN = 'Scan',
    APPOINTMENT = 'Appointment',
}

export interface HistoryItem {
    _id: string;
    type: HistoryType;
    title: string;
    content: string;
    timestamp: string;
}