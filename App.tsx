import React, { useState, useEffect, useCallback } from 'react';
import { AppView, HistoryItem, User, Doctor } from './types';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import FeatureCard from './components/FeatureCard';
import ChatView from './components/ChatView';
import ScanView from './components/ScanView';
import DoctorsView from './components/DoctorsView';
import HistoryView from './components/HistoryView';
import LoginView from './components/LoginView';
import SignupView from './components/SignupView';
import DrawerMenu from './components/DrawerMenu';
import DoctorProfileView from './components/DoctorProfileView';
import BookingConfirmationView from './components/BookingConfirmationView';
import ProfileView from './components/ProfileView';
import { ChatIcon, ScanIcon, LocationIcon, HistoryIcon, LogoIcon, CalendarIcon } from './components/icons';
import * as api from './services/apiService';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.SPLASH);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<{doctor: Doctor, slot: string} | null>(null);
  const [theme, setTheme] = useState<Theme>(localStorage.getItem('theme') as Theme || 'light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const fetchUserData = useCallback(async () => {
    try {
      const { user } = await api.getProfile();
      const { history } = await api.getHistory();
      setCurrentUser(user);
      setHistory(history);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Session verification failed", error);
      api.logout(); // Clear invalid token
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const token = api.getToken();
      let authenticated = false;
      if (token) {
        authenticated = await fetchUserData();
      }
      setView(authenticated ? AppView.HOME : AppView.LOGIN);
      setIsLoading(false);
    };

    const splashTimer = setTimeout(() => {
      checkAuth();
    }, 2500);

    return () => clearTimeout(splashTimer);
  }, [fetchUserData]);

  const handleLoginSuccess = async (user: User, token: string) => {
    api.setToken(token);
    await fetchUserData();
    setView(AppView.WELCOME);
    setTimeout(() => {
        setView(AppView.HOME);
    }, 2000);
  };
  
  const handleSignupSuccess = (user: User, token: string) => {
    handleLoginSuccess(user, token);
  };

  const refreshHistory = async () => {
    if (isAuthenticated) {
        try {
            const { history } = await api.getHistory();
            setHistory(history);
        } catch (error) {
            console.error("Failed to refresh history:", error);
        }
    }
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      await api.deleteHistoryItem(id);
      setHistory(prevHistory => prevHistory.filter(item => item._id !== id));
    } catch (error) {
      console.error("Failed to delete history item:", error);
      alert("Could not delete item. Please try again.");
    }
  };
  
  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setView(AppView.DOCTOR_PROFILE);
  };

  const handleBookingConfirmed = async (doctor: Doctor, slot: string) => {
    try {
      await api.bookAppointment({ doctor, slot });
      await refreshHistory(); // Refresh history to show the new appointment
      setConfirmedBooking({doctor, slot});
      setView(AppView.BOOKING_CONFIRMATION);
    } catch (error) {
      console.error("Failed to book appointment:", error);
      alert("Booking failed. Please try again.");
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setHistory([]);
    setIsAuthenticated(false);
    setIsDrawerOpen(false);
    setView(AppView.LOGIN);
  };
  
  const goHome = () => {
      setSelectedDoctor(null);
      setConfirmedBooking(null);
      setView(AppView.HOME);
  }

  const navigate = (newView: AppView) => {
    setView(newView);
    setIsDrawerOpen(false);
  }

  const WelcomeView: React.FC = () => (
      <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-gray-800 animate-fade-in">
          <LogoIcon className="h-16 w-16 text-teal-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">WELCOME,</h1>
          <p className="text-2xl text-gray-600 dark:text-gray-400">{currentUser?.name.split(' ')[0].toUpperCase()}</p>
      </div>
  );

  const renderView = () => {
    if (isLoading) return null; // Or a loading spinner

    if (!isAuthenticated) {
        switch (view) {
            case AppView.LOGIN:
                return <LoginView onLoginSuccess={handleLoginSuccess} switchToSignup={() => setView(AppView.SIGNUP)} />;
            case AppView.SIGNUP:
                return <SignupView onSignupSuccess={handleSignupSuccess} switchToLogin={() => setView(AppView.LOGIN)} />;
            default:
                return <LoginView onLoginSuccess={handleLoginSuccess} switchToSignup={() => setView(AppView.SIGNUP)} />;
        }
    }
    
    switch (view) {
      case AppView.WELCOME:
        return <WelcomeView />;
      case AppView.CHAT:
        return <ChatView onBack={goHome} onNewChatEntry={refreshHistory} />;
      case AppView.SCAN:
        return <ScanView onBack={goHome} onNewScanEntry={refreshHistory} />;
      case AppView.DOCTORS:
        return <DoctorsView onBack={goHome} onSelectDoctor={handleSelectDoctor} />;
       case AppView.DOCTOR_PROFILE:
        return selectedDoctor && <DoctorProfileView doctor={selectedDoctor} onBack={() => setView(AppView.DOCTORS)} onBookingConfirmed={handleBookingConfirmed} />;
      case AppView.BOOKING_CONFIRMATION:
        return confirmedBooking && <BookingConfirmationView booking={confirmedBooking} onDone={goHome} />;
      case AppView.HISTORY:
        return <HistoryView history={history} onBack={goHome} onDeleteItem={deleteHistoryItem} />;
      case AppView.PROFILE:
        return currentUser && <ProfileView user={currentUser} onBack={goHome} />;
      case AppView.HOME:
        return (
          <div className="p-4 grid grid-cols-2 gap-4 animate-fade-in">
            <FeatureCard title="AI Chatbot" description="Analyze your symptoms" icon={<ChatIcon />} onClick={() => setView(AppView.CHAT)} />
            <FeatureCard title="Scan Document" description="Prescriptions & X-Rays" icon={<ScanIcon />} onClick={() => setView(AppView.SCAN)} />
            <FeatureCard title="Doctors Near Me" description="Find local specialists" icon={<LocationIcon />} onClick={() => setView(AppView.DOCTORS)} />
            <FeatureCard title="View History" description="Past activity" icon={<HistoryIcon />} onClick={() => setView(AppView.HISTORY)} />
            <FeatureCard title="Book Appointment" description="Schedule a visit" icon={<CalendarIcon />} onClick={() => setView(AppView.DOCTORS)} />
          </div>
        );
      default:
        return null;
    }
  };

  if (view === AppView.SPLASH) {
    return <SplashScreen />;
  }

  if (!isAuthenticated) {
    return renderView();
  }

  const getTitle = () => {
    if (view === AppView.HOME) return "Dashboard";
    if (view === AppView.DOCTOR_PROFILE) return selectedDoctor?.name || 'Doctor Profile';
    if (view === AppView.BOOKING_CONFIRMATION) return 'Booking Confirmed';
    if (view === AppView.PROFILE) return 'My Profile';
    return `Meda AI - ${view}`;
  };

  const handleBack = () => {
      switch (view) {
          case AppView.DOCTOR_PROFILE:
              setView(AppView.DOCTORS);
              break;
          default:
              goHome();
      }
  };

  return (
    <div className="h-screen w-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans max-w-lg mx-auto shadow-2xl">
      <DrawerMenu 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onNavigate={navigate}
        onLogout={handleLogout}
        theme={theme}
        setTheme={setTheme}
        />
      <Header
        title={getTitle()}
        showMenuButton={view === AppView.HOME}
        showBackButton={view !== AppView.HOME && view !== AppView.WELCOME}
        onMenuClick={() => setIsDrawerOpen(true)}
        onBack={handleBack}
      />
      <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-800">
        {renderView()}
      </main>
    </div>
  );
};

export default App;