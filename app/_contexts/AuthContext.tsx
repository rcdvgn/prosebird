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

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Listen for auth state changes and handle Firestore user creation/retrieval
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Check if the user already exists in Firestore
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        const providerPhotoURL = currentUser.photoURL || null;

        if (!userDoc.exists()) {
          // New user setup
          const newUser: any = {
            email: currentUser.email,
            createdAt: serverTimestamp(),
            profilePicture: {
              userUploaded: null, // No custom upload yet
              provider: providerPhotoURL, // Use provider's photo if available
            },
          };

          await setDoc(userDocRef, newUser);
          setUser({ id: currentUser.uid, ...newUser });
        } else {
          // Existing user, update provider photo if it has changed
          const userData = userDoc.data();
          if (
            providerPhotoURL &&
            userData.profilePicture?.provider !== providerPhotoURL
          ) {
            await updateDoc(userDocRef, {
              "profilePicture.provider": providerPhotoURL,
            });
          }
          setUser({ id: currentUser.uid, ...userDoc.data() });
        }
      } else {
        // User logged out, clear the user state
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup the subscription on unmount
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
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if Firestore needs updating after Google login
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create new user document
        const newUser: any = {
          email: user.email,
          createdAt: serverTimestamp(),
          profilePicture: {
            userUploaded: null,
            provider: user.photoURL || null,
          },
        };

        await setDoc(userDocRef, newUser);
      } else {
        // Update provider photo if it has changed
        if (
          user.photoURL &&
          userDoc.data().profilePicture?.provider !== user.photoURL
        ) {
          await updateDoc(userDocRef, {
            "profilePicture.provider": user.photoURL,
          });
        }
      }
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
