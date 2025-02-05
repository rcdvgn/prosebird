import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { subscribeToRecentScripts } from "../_services/client";
import { getScriptPeople } from "../_services/client";
interface Script {
  id: string;
  title: string;
  lastModified: any;
}

interface RecentScriptsContextType {
  recentlyModified: Script[] | null;
}

const RecentScriptsContext = createContext<
  RecentScriptsContextType | undefined
>(undefined);

export const RecentScriptsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useAuth();
  const [recentlyModified, setRecentlyModified] = useState<Script[] | null>(
    null
  );

  useEffect(() => {
    const unsubscribe = subscribeToRecentScripts(
      user.id,
      async (recentScripts: Script[]) => {
        const scriptsWithPeople = await Promise.all(
          recentScripts.map(async (script: any) => {
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
        setRecentlyModified(scriptsWithPeople);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <RecentScriptsContext.Provider value={{ recentlyModified }}>
      {children}
    </RecentScriptsContext.Provider>
  );
};

export const useRecentScripts = (): RecentScriptsContextType => {
  const context = useContext(RecentScriptsContext);
  if (context === undefined) {
    throw new Error(
      "useRecentScripts must be used within a RecentScriptsProvider"
    );
  }
  return context;
};
