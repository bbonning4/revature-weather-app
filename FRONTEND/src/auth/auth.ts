import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    User
} from "firebase/auth";
import { auth } from "./firebase";

// Sign Up with Email/Password
export const signUp = async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password);
};

// Sign In with Email/Password
export const signIn = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
};

// Sign In with Google
export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
};

// Sign Out
export const logOut = async () => {
    return await signOut(auth);
};

// Get currently logged-in user
export const getCurrentUser = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};
