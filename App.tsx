import React, { useState, useEffect } from 'react';
import { AppView, User } from './types';
import Landing from './screens/Landing';
import Login from './screens/Login';
import Register from './screens/Register';
import EmailVerification from './screens/EmailVerification';
import MFA from './screens/MFA';
import Onboarding from './screens/Onboarding';
import Dashboard from './screens/Dashboard';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.Landing);
  const [user, setUser] = useState<User | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string>('');

  // Determine what to render based on currentView state
  const renderView = () => {
    switch (currentView) {
      case AppView.Landing:
        return <Landing onNavigate={setCurrentView} />;
      
      case AppView.Login:
        return (
          <Login 
            onNavigate={setCurrentView} 
            onLoginSuccess={(userData) => {
              setUser(userData);
              setCurrentView(AppView.MFA); // Always enforce MFA after login logic
            }} 
          />
        );

      case AppView.Register:
        return (
          <Register 
            onNavigate={setCurrentView}
            onRegisterSuccess={(email) => {
                setPendingEmail(email);
                setCurrentView(AppView.EmailVerification);
            }} 
          />
        );

      case AppView.EmailVerification:
        return (
            <EmailVerification 
                email={pendingEmail} 
                onVerified={() => {
                    // In a real app, verify token, get user data.
                    // Here we assume successful verification -> prompt login or go to Onboarding flow via Login
                    setCurrentView(AppView.Login); 
                }}
            />
        );
        
      case AppView.MFA:
          return (
              <MFA onSuccess={() => {
                  if (user && !user.hasCompletedOnboarding) {
                      setCurrentView(AppView.Onboarding);
                  } else {
                      setCurrentView(AppView.Dashboard);
                  }
              }} />
          )

      case AppView.Onboarding:
        return (
            <Onboarding 
                onComplete={(data) => {
                    // Update user state locally
                    if (user) {
                        setUser({ ...user, hasCompletedOnboarding: true });
                    }
                    setCurrentView(AppView.Dashboard);
                }}
            />
        );

      case AppView.Dashboard:
        return (
            <Dashboard 
                user={user} 
                onLogout={() => {
                    setUser(null);
                    setCurrentView(AppView.Landing);
                }} 
            />
        );
      
      default:
        return <Landing onNavigate={setCurrentView} />;
    }
  };

  return (
    <>
      {renderView()}
    </>
  );
};

export default App;