import { auth } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendEmailVerification as firebaseSendEmailVerification,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  User
} from 'firebase/auth';

export const authService = {
  // --- Email/Password ---
  async signUp(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  async signIn(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  async signOut() {
    await firebaseSignOut(auth);
  },

  async sendVerificationEmail(user: User) {
    await firebaseSendEmailVerification(user);
  },

  // --- OAuth Providers ---
  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  },

  async signInWithMicrosoft() {
    const provider = new OAuthProvider('microsoft.com');
    // Add specific scopes if needed
    // provider.addScope('mail.read');
    const result = await signInWithPopup(auth, provider);
    return result.user;
  },

  async signInWithApple() {
    const provider = new OAuthProvider('apple.com');
    const result = await signInWithPopup(auth, provider);
    return result.user;
  }
};