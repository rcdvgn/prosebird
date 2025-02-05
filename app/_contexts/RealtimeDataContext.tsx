"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import {
  collection,
  query as fsQuery,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db, rtdb } from "@/app/_config/firebase/client";
import {
  getDatabase,
  ref,
  query as rtdbQuery,
  orderByChild,
  equalTo,
  onValue,
} from "firebase/database";
import {
  checkPresentationStatus,
  createPresentationSubscriptions,
  getScriptPeople,
  subscribeToNotifications,
  subscribeToPresentationParticipants,
  subscribeToScripts,
} from "../_services/client";

// Type definitions
interface Script {
  id: string;
  title: string;
  lastModified: any;
  // ... other fields
}

interface Presentation {
  id: string;
  createdAt: any;
  // ... other fields (and likely createdBy)
  createdBy: string;
}

interface Notification {
  id: string;
  type: string; // can be literal like "friendRequest" or coded like "03"
  userId: string;
  createdAt: any;
  data: any;
}

interface RealtimeDataContextType {
  scripts: Script[] | null;
  presentations: Presentation[] | null;
  notifications: Notification[] | null;
}

// Create the context
const RealtimeDataContext = createContext<RealtimeDataContextType | undefined>(
  undefined
);

// Provider component
export const RealtimeDataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [scripts, setScripts] = useState<Script[] | null>(null);
  const [presentationIds, setPresentationIds] = useState<any>(null);
  const [presentations, setPresentations] = useState<Presentation[] | null>(
    null
  );
  const [notifications, setNotifications] = useState<Notification[] | null>(
    null
  );

  // --- Scripts from Firestore ---
  useEffect(() => {
    if (!user) return;

    const onScriptsUpdate = async (scriptsData: any) => {
      const uniqueScripts = Array.from(
        new Map(scriptsData.map((script: any) => [script.id, script])).values()
      );

      const scriptsWithPeople = await Promise.all(
        uniqueScripts.map(async (script: any) => {
          const people = await getScriptPeople(
            script.createdBy,
            script.editors,
            script.viewers
          );

          return {
            ...script,
            editors: people.editors,
            viewers: people.viewers,
            createdBy: people.createdBy,
          };
        })
      );

      // Sort combined results by lastModified
      scriptsWithPeople.sort(
        (a: any, b: any) => b.lastModified - a.lastModified
      );
      setScripts(scriptsWithPeople);
    };

    const unsubscribe = subscribeToScripts(user.id, onScriptsUpdate);

    return () => unsubscribe();
  }, [user?.id]);

  // --- Presentations from Realtime Database ---
  useEffect(() => {
    if (!user) return;

    // This callback is invoked whenever any presentation data is updated.
    const onPresentationsUpdate = async (updatedPresentations: any[]) => {
      // Optionally update your component's state with the new presentation data.

      const correctedStatusPresentations: any = await checkPresentationStatus(
        updatedPresentations
      );

      setPresentations(correctedStatusPresentations);
    };

    // Create the subscription manager for presentations.
    const presentationSubscriptions = createPresentationSubscriptions(
      onPresentationsUpdate
    );

    // Called when the Firestore query (presentation participants) returns new presentation IDs.
    const onPresentationParticipantsUpdate = (
      updatedPresentationIds: string[]
    ) => {
      setPresentationIds(updatedPresentationIds);
      // Update subscriptions only for new/untracked presentation IDs.
      presentationSubscriptions.updateSubscriptions(updatedPresentationIds);
    };

    // Subscribe to presentation participants from Firestore.
    const unsubscribeParticipants = subscribeToPresentationParticipants(
      user.id,
      onPresentationParticipantsUpdate
    );

    // Cleanup: Unsubscribe from both Firestore and RTDB subscriptions.
    return () => {
      unsubscribeParticipants();
      presentationSubscriptions.unsubscribeAll();
    };
  }, [user?.id]);

  //   --- Notifications from Firestore ---
  useEffect(() => {
    if (!user) return;

    const onNotificationsUpdate = (updatedNotifications: any) => {
      setNotifications(updatedNotifications);
    };

    const unsubscribe = subscribeToNotifications(
      user.id,
      onNotificationsUpdate
    );

    return () => unsubscribe();
  }, [user?.id]);

  return (
    <RealtimeDataContext.Provider
      value={{ scripts, presentations, notifications }}
    >
      {children}
    </RealtimeDataContext.Provider>
  );
};

// Custom hook to use the context
export const useRealtimeData = (): RealtimeDataContextType => {
  const context = useContext(RealtimeDataContext);
  if (context === undefined) {
    throw new Error(
      "useRealtimeData must be used within a RealtimeDataProvider"
    );
  }
  return context;
};
