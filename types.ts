export enum UserRole {
  Psychologist = 'Psychologist',
  Psychiatrist = 'Psychiatrist',
  Neuropsychologist = 'Neuropsychologist',
  OccupationalTherapist = 'Occupational Therapist',
  Other = 'Other'
}

export enum AccountType {
  Independent = 'Independent',
  Clinic = 'Clinic'
}

export enum AppView {
  Landing = 'LANDING',
  Login = 'LOGIN',
  Register = 'REGISTER',
  EmailVerification = 'EMAIL_VERIFICATION',
  MFA = 'MFA',
  Onboarding = 'ONBOARDING',
  Dashboard = 'DASHBOARD'
}

export interface ClinicDetails {
  name: string;
  cnpj: string;
  location: string;
  therapistCount: string;
  technicalDirector: string;
}

export interface User {
  email: string;
  name: string;
  role: UserRole | string;
  accountType: AccountType;
  clinicDetails?: ClinicDetails;
  crpCrm: string; // Registration Number
  country: string;
  patientVolume: string;
  isVerified: boolean;
  hasCompletedOnboarding: boolean;
  credits: number; 
  plan: 'standard' | 'beta_test';
}

export interface OnboardingData {
  acceptedTerms: boolean;
  yearsExperience: string;
  workContexts: string[];
  ageGroups: string[];
  approaches: string[];
  language: string;
  sessionType: string;
  reportStyle: string;
  notifications: string[];
}