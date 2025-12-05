import { db } from '../config/firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { FirestoreTherapist, FirestorePatient, FirestoreSession } from '../config/firestoreSchema';

const COLLECTION_THERAPISTS = 'therapists';
const COLLECTION_PATIENTS = 'patients';
const COLLECTION_SESSIONS = 'sessions';
const COLLECTION_BETA_CODES = 'beta_codes';

export const firestoreService = {
  // --- Therapist ---
  async createTherapist(uid: string, data: Omit<FirestoreTherapist, 'id'>) {
    const docRef = doc(db, COLLECTION_THERAPISTS, uid);
    await setDoc(docRef, {
      ...data,
      id: uid,
      createdAt: Timestamp.now(),
      lastLogin: Timestamp.now()
    });
  },

  async getTherapist(uid: string): Promise<FirestoreTherapist | null> {
    const docRef = doc(db, COLLECTION_THERAPISTS, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as FirestoreTherapist;
    }
    return null;
  },

  async updateTherapist(uid: string, data: Partial<FirestoreTherapist>) {
    const docRef = doc(db, COLLECTION_THERAPISTS, uid);
    await updateDoc(docRef, data);
  },

  // --- Beta Codes ---
  async validateBetaCode(code: string): Promise<boolean> {
    // Note: In a real app, use a Cloud Function or Transaction to prevent race conditions
    // This is a simplified read-check
    const q = query(
      collection(db, COLLECTION_BETA_CODES), 
      where("code", "==", code),
      where("isValid", "==", true)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  },

  async claimBetaCode(code: string, uid: string) {
    const q = query(collection(db, COLLECTION_BETA_CODES), where("code", "==", code));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        isValid: false,
        usedBy: uid
      });
    }
  },

  // --- Patients (Basic Shell) ---
  async createPatient(therapistId: string, data: Omit<FirestorePatient, 'id' | 'therapistId' | 'createdAt'>) {
    const colRef = collection(db, COLLECTION_PATIENTS);
    await addDoc(colRef, {
      ...data,
      therapistId,
      createdAt: Timestamp.now()
    });
  },

  // --- Sessions (Basic Shell) ---
  async createSession(therapistId: string, patientId: string, data: any) {
    const colRef = collection(db, COLLECTION_SESSIONS);
    await addDoc(colRef, {
      ...data,
      therapistId,
      patientId,
      date: Timestamp.now(),
      status: 'processing'
    });
  }
};