import { Timestamp } from 'firebase/firestore/lite';

// --- Therapist Collection ---
export interface FirestoreTherapist {
  id: string; // Document ID (Auth UID)
  email: string;
  name: string;
  profession: 'Psychologist' | 'Psychiatrist' | 'Neuropsychologist' | 'Occupational Therapist' | 'Other';
  registrationNumber: string; // CRP/CRM
  registrationState?: string;
  country: string;
  accountType: 'Independent' | 'Clinic';
  
  clinicData?: {
    clinicName: string;
    clinicCNPJ: string;
    clinicLocation: string;
    therapistCount: string;
    technicalDirector: string;
  };

  patientVolume: string;
  approaches: string[];
  
  preferences: {
    language: string;
    sessionType: string;
    reportStyle: string;
    notifications: string[];
  };

  betaAccessCode?: string;
  transcriptionCredits: number;
  planType: 'beta_test' | 'free' | 'pro';
  
  accountStatus: 'pending_email_verification' | 'active' | 'suspended';
  mfaEnabled: boolean;
  
  createdAt: Timestamp;
  lastLogin: Timestamp;
}

// --- Patient Collection ---
export interface FirestorePatient {
  id: string;
  therapistId: string;
  name: string; // Ideally encrypted on client before sending
  age: number; // Encrypted
  diagnosis?: string; // Encrypted
  framework?: string;
  goals?: string[];
  createdAt: Timestamp;
}

// --- Session Collection ---
export interface FirestoreSession {
  id: string;
  patientId: string;
  therapistId: string;
  date: Timestamp;
  
  audioUrlPatient?: string;
  audioUrlTherapist?: string;
  
  transcriptionPatient?: string; // Encrypted text
  transcriptionTherapist?: string; // Encrypted text
  
  analysis?: {
    neuropsychological?: any;
    confrontative?: any;
    soapNote?: any;
    progressMarkers?: any;
  };
  
  status: 'processing' | 'completed' | 'error';
}

// --- Beta Codes Collection ---
export interface FirestoreBetaCode {
  code: string;
  isValid: boolean;
  usedBy?: string; // Therapist ID
  expiresAt: Timestamp;
}