import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../config/firebase';
import { firestoreService } from '../services/firestoreService';
import { FirestoreTherapist } from '../config/firestoreSchema';

interface AuthContextType {
  currentUser: User | null;
  userProfile: FirestoreTherapist | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<FirestoreTherapist | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (auth && auth.currentUser) {
      try {
        const profile = await firestoreService.getTherapist(auth.currentUser.uid);
        setUserProfile(profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }
  };

  useEffect(() => {
    // Safety Check: If Firebase keys are missing, auth is an empty object {}.
    // We check if it has the internal 'app' property or similar to verify it's a real Auth instance.
    if (!auth || !(auth as any).app) {
      console.warn("Firebase Auth not initialized. Missing API keys? Skipping auth listener.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await refreshProfile();
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, refreshProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);