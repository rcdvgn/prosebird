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
  checkPresentationStatus,
  createPresentationSubscriptions,
  getPeople,
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
}

interface Presentation {
  id: string;
  createdAt: any;
  createdBy: string;
}

interface Notification {
  id: string;
  type: string;
  userId: string;
  createdAt: any;
  data: any;
}

interface RealtimeDataContextType {
  scripts: Script[] | null;
  presentations: Presentation[] | null;
  notifications: Notification[] | null;
}

const RealtimeDataContext = createContext<any>(undefined);

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
    const flatUserIds = userIds.flat();
    const unfetchedUserIds = _.uniq(
      _.difference(flatUserIds, Object.keys(people))
    );

    if (!unfetchedUserIds.length) return;

    try {
      const fetchedPeople = await getPeople(unfetchedUserIds, []);

      setPeople((prevPeople: any) => {
        const formattedFetchedPeople = fetchedPeople.reduce(
          (acc: any, user: any) => {
            if (user?.id && flatUserIds.includes(user.id)) {
              acc[user.id] = { ...user };
              delete acc[user.id].id;
            }
            return acc;
          },
          {}
        );

        return { ...prevPeople, ...formattedFetchedPeople };
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Then modify the useEffect to prevent unnecessary re-renders
  useEffect(() => {
    if (!user) return;

    const getAllUserIds = () => {
      const userIds = [];

      if (scripts) {
        userIds.push(
          ...scripts.map((script: any) => [
            script.createdBy,
            ...(script.editors || []),
            ...(script.viewers || []),
          ])
        );
      }

      if (presentations) {
        userIds.push(
          ...presentations.map((presentation: any) => [
            ...(Object.keys(presentation.participants) || []),
            ...(presentation.hosts || []),
          ])
        );
      }

      if (notifications) {
        userIds.push(
          ...notifications.map((notification: any) => {
            if (notification.type === "presentationInvite") {
              return notification.data.presentationHosts || [];
            }
            return [];
          })
        );
      }

      return userIds;
    };

    const userIds = getAllUserIds();
    if (userIds.length > 0) {
      getUserData(userIds);
    }
  }, [user?.id, scripts, presentations, notifications]);

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
