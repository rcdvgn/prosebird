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
  getPeople,
  getScriptPeople,
  subscribeToNotifications,
  subscribeToPresentationParticipants,
  subscribeToScripts,
} from "../_services/client";
import _ from "lodash";

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
const RealtimeDataContext = createContext<any>(undefined);

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

  const [people, setPeople] = useState<any>({});

  // Combined useEffect for subscriptions that depend on user?.id
  useEffect(() => {
    if (!user) return;

    // --- Scripts Subscription ---
    const onScriptsUpdate = async (scriptsData: any) => {
      const uniqueScripts: any = Array.from(
        new Map(scriptsData.map((script: any) => [script.id, script])).values()
      );

      uniqueScripts.sort((a: any, b: any) => b.lastModified - a.lastModified);
      setScripts(uniqueScripts);
    };
    const unsubscribeScripts = subscribeToScripts(user.id, onScriptsUpdate);

    // --- Presentations Subscription ---
    const onPresentationsUpdate = async (updatedPresentations: any[]) => {
      const correctedStatusPresentations: any = await checkPresentationStatus(
        updatedPresentations
      );
      setPresentations(correctedStatusPresentations);
    };

    // Create a presentation subscriptions manager
    const presentationSubscriptions = createPresentationSubscriptions(
      onPresentationsUpdate
    );

    const onPresentationParticipantsUpdate = (
      updatedPresentationIds: string[]
    ) => {
      setPresentationIds(updatedPresentationIds);
      presentationSubscriptions.updateSubscriptions(updatedPresentationIds);
    };
    const unsubscribeParticipants = subscribeToPresentationParticipants(
      user.id,
      onPresentationParticipantsUpdate
    );

    // --- Notifications Subscription ---
    const onNotificationsUpdate = (updatedNotifications: any) => {
      setNotifications(updatedNotifications);
    };
    const unsubscribeNotifications = subscribeToNotifications(
      user.id,
      onNotificationsUpdate
    );

    // Cleanup all subscriptions on unmount or when user changes
    return () => {
      unsubscribeScripts();
      unsubscribeParticipants();
      presentationSubscriptions.unsubscribeAll();
      unsubscribeNotifications();
    };
  }, [user?.id]);

  const formatUserDataIntoPeople = (userIds: any, rawUserData: any) => {
    return rawUserData.reduce((acc: any, user: any) => {
      if (user.id && userIds.includes(user.id)) {
        acc[user.id] = { ...user };
        delete acc[user.id].id;
      }
      return acc;
    }, {});
  };

  const getUserData = async (userIds: any) => {
    const unfetchedUserIds = _.uniq(_.difference(userIds, Object.keys(people)));
    if (!unfetchedUserIds.length) return;

    const fetchedPeople = await getPeople(unfetchedUserIds, []);

    const formattedFetchedPeople: any = formatUserDataIntoPeople(
      userIds,
      fetchedPeople
    );

    const newPeople = { ...formattedFetchedPeople, ...people };
    setPeople(newPeople);
  };

  useEffect(() => {
    if (!user) return;

    if (scripts) {
      const userIds = scripts
        .map((script: any) => [
          script.createdBy,
          ...script.editors,
          ...script.viewers,
        ])
        .flat();

      getUserData(userIds);
    }

    if (presentations) {
      const userIds = presentations.map((presentation: any) =>
        Object.keys(presentation.participants || {})
      );

      getUserData(userIds);
    }

    if (notifications) {
      const userIds = notifications.map((notification: any) => {
        switch (notification.type) {
          case "presentationInvite":
            return notification.data.presentationHost;
          default:
            console.error("Unhandled notification type:", notification.type);
        }

        return null;
      });

      getUserData(userIds);
    }
  }, [user?.id, scripts, notifications, notifications]);

  return (
    <RealtimeDataContext.Provider
      value={{ scripts, presentations, notifications, people }}
    >
      {children}
    </RealtimeDataContext.Provider>
  );
};

// Custom hook to use the context
export const useRealtimeData = (): any => {
  const context = useContext(RealtimeDataContext);
  if (context === undefined) {
    throw new Error(
      "useRealtimeData must be used within a RealtimeDataProvider"
    );
  }
  return context;
};
