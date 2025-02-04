"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/app/_config/firebase/client";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

// Define the context type
interface AuthContextType {
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A helper function to check if a URL looks like a user-uploaded image (from Google Cloud Storage)
const isUserUploadedURL = (url: string): boolean => {
  // Adjust the prefix based on your Cloud Storage URL pattern
  return url.startsWith("https://storage.googleapis.com/");
};

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // if logging in
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        const providerPhotoURL = currentUser.photoURL || null;

        // if logging in but the user doesnt exist yet
        if (!userDoc.exists()) {
          const newUser: any = {
            email: currentUser.email,
            createdAt: serverTimestamp(),
            profilePictureURL: providerPhotoURL,
          };

          await setDoc(userDocRef, newUser);
          setUser({ id: currentUser.uid, ...newUser });

          // if logging in and the user already exists
        } else {
          const userData = userDoc.data();

          if (
            providerPhotoURL &&
            (!userData.profilePictureURL ||
              (!isUserUploadedURL(userData.profilePictureURL) &&
                userData.profilePictureURL !== providerPhotoURL))
          ) {
            await updateDoc(userDocRef, {
              profilePictureURL: providerPhotoURL,
            });
          }
          setUser({ id: currentUser.uid, ...userData });
        }
        // if logging out
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Google Login function
  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  // Signup function
  const signup = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, googleLogin, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
