import React, { useState, useEffect } from 'react';
import { AppView, User } from './types';
import Landing from './screens/Landing';
import Login from './screens/Login';
import Register from './screens/Register';
import EmailVerification from './screens/EmailVerification';
import MFA from './screens/MFA';
import Onboarding from './screens/Onboarding';
import Dashboard from './screens/Dashboard';
import { AuthProvider, useAuth } from './hooks/useAuth'; // Import Context

// Internal Component to handle view logic based on Auth State
const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.Landing);
  // We can eventually replace local user state with the one from useAuth, 
  // but for now we keep the structure to minimize refactoring risk in this step.
  const { currentUser, userProfile } = useAuth();
  
  // Logic to redirect if user is logged in but on Landing/Login?
  // For this stage, we keep the manual navigation requested in previous prompts, 
  // but we can auto-inject the authenticated user data into dashboard.

  const [pendingEmail, setPendingEmail] = useState<string>('');

  const renderView = () => {
    switch (currentView) {
      case AppView.Landing:
        return <Landing onNavigate={setCurrentView} />;
      
      case AppView.Login:
        return (
          <Login 
            onNavigate={setCurrentView} 
            onLoginSuccess={(userData) => {
              // Now we might get real user data here
              setCurrentView(AppView.MFA); 
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
                email={pendingEmail || currentUser?.email || ''} 
                onVerified={() => {
                    setCurrentView(AppView.Login); 
                }}
            />
        );
        
      case AppView.MFA:
          return (
              <MFA onSuccess={() => {
                  // Check if profile exists and has completed onboarding
                  // In real integration, we check userProfile?.accountStatus or similar
                  if (userProfile && !userProfile.preferences) {
                       // Assumption: if preferences are empty, onboarding needed
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
                    // Here we would call firestoreService.updateTherapist with onboarding data
                    setCurrentView(AppView.Dashboard);
                }}
            />
        );

      case AppView.Dashboard:
        return (
            <Dashboard 
                // Adapt Firestore Profile to UI User Type
                user={userProfile ? {
                   email: userProfile.email,
                   name: userProfile.name,
                   role: userProfile.profession,
                   accountType: userProfile.accountType as any,
                   crpCrm: userProfile.registrationNumber,
                   country: userProfile.country,
                   patientVolume: userProfile.patientVolume,
                   isVerified: userProfile.accountStatus === 'active',
                   hasCompletedOnboarding: true,
                   credits: userProfile.transcriptionCredits,
                   plan: userProfile.planType === 'beta_test' ? 'beta_test' : 'standard'
                } : null} 
                onLogout={() => {
                    setCurrentView(AppView.Landing);
                }} 
            />
        );
      
      default:
        return <Landing onNavigate={setCurrentView} />;
    }
  };

  return <>{renderView()}</>;
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;