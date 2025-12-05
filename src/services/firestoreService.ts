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

const checkDb = () => {
    if (!db || !(db as any).app) {
        throw new Error("Firestore is not initialized. Please check your environment variables (API Keys).");
    }
};

export const firestoreService = {
  // --- Therapist ---
  async createTherapist(uid: string, data: Omit<FirestoreTherapist, 'id'>) {
    checkDb();
    console.log(`[FirestoreService] Creating therapist profile for UID: ${uid}`);
    try {
      const docRef = doc(db, COLLECTION_THERAPISTS, uid);
      await setDoc(docRef, {
        ...data,
        id: uid,
        createdAt: Timestamp.now(),
        lastLogin: Timestamp.now()
      });
      console.log(`[FirestoreService] Therapist profile created successfully.`);
    } catch (error: any) {
      console.error("[FirestoreService] createTherapist Error:", error);
      if (error.code === 'permission-denied') {
        console.error("Firestore Permission Denied. Check security rules for 'therapists' collection.");
      }
      throw error;
    }
  },

  async getTherapist(uid: string): Promise<FirestoreTherapist | null> {
    checkDb();
    try {
      const docRef = doc(db, COLLECTION_THERAPISTS, uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as FirestoreTherapist;
      }
      return null;
    } catch (error) {
      console.error("[FirestoreService] getTherapist Error:", error);
      throw error;
    }
  },

  async updateTherapist(uid: string, data: Partial<FirestoreTherapist>) {
    checkDb();
    try {
      const docRef = doc(db, COLLECTION_THERAPISTS, uid);
      await updateDoc(docRef, data);
    } catch (error) {
       console.error("[FirestoreService] updateTherapist Error:", error);
       throw error;
    }
  },

  // --- Beta Codes ---
  async validateBetaCode(code: string): Promise<boolean> {
    checkDb();
    try {
        const q = query(
          collection(db, COLLECTION_BETA_CODES), 
          where("code", "==", code),
          where("isValid", "==", true)
        );
        
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    } catch (error) {
        console.error("[FirestoreService] validateBetaCode Error:", error);
        return false;
    }
  },

  async claimBetaCode(code: string, uid: string) {
    checkDb();
    try {
        const q = query(collection(db, COLLECTION_BETA_CODES), where("code", "==", code));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;
          await updateDoc(docRef, {
            isValid: false,
            usedBy: uid
          });
        }
    } catch (error) {
        console.error("[FirestoreService] claimBetaCode Error:", error);
    }
  },

  // --- Patients (Basic Shell) ---
  async createPatient(therapistId: string, data: Omit<FirestorePatient, 'id' | 'therapistId' | 'createdAt'>) {
    checkDb();
    const colRef = collection(db, COLLECTION_PATIENTS);
    await addDoc(colRef, {
      ...data,
      therapistId,
      createdAt: Timestamp.now()
    });
  },

  // --- Sessions (Basic Shell) ---
  async createSession(therapistId: string, patientId: string, data: any) {
    checkDb();
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