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
    console.log(`[AuthService] Attempting signUp for: ${email}`);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log(`[AuthService] User created successfully: ${userCredential.user.uid}`);
      return userCredential.user;
    } catch (error) {
      console.error("[AuthService] signUp Error:", error);
      throw error;
    }
  },

  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("[AuthService] signIn Error:", error);
      throw error;
    }
  },

  async signOut() {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("[AuthService] signOut Error:", error);
    }
  },

  async sendVerificationEmail(user: User) {
    try {
      await firebaseSendEmailVerification(user);
      console.log("[AuthService] Verification email sent.");
    } catch (error) {
      console.error("[AuthService] sendVerificationEmail Error:", error);
    }
  },

  // --- OAuth Providers ---
  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error("[AuthService] Google SignIn Error:", error);
      throw error;
    }
  },

  async signInWithMicrosoft() {
    try {
      const provider = new OAuthProvider('microsoft.com');
      // Add specific scopes if needed
      // provider.addScope('mail.read');
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error("[AuthService] Microsoft SignIn Error:", error);
      throw error;
    }
  },

  async signInWithApple() {
    try {
      const provider = new OAuthProvider('apple.com');
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error("[AuthService] Apple SignIn Error:", error);
      throw error;
    }
  }
};