import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { subscribeToRecentScripts } from "../actions/actions"; // Import the action
import { getScriptPeople } from "../actions/actions";
// Define the type for the script object
interface Script {
  id: string;
  title: string;
  lastModified: any; // Firestore timestamp type
  // Add any other fields you expect in the script object
}

// Define the context type
interface RecentScriptsContextType {
  recentlyModified: Script[] | null;
}

// Create the context
const RecentScriptsContext = createContext<
  RecentScriptsContextType | undefined
>(undefined);

// Provider component
export const RecentScriptsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [recentlyModified, setRecentlyModified] = useState<Script[] | null>(
    null
  );

  useEffect(() => {
    const unsubscribe = subscribeToRecentScripts(
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
        // console.log(scriptsWithPeople);
        setRecentlyModified(scriptsWithPeople);
      }
    );

    return () => unsubscribe();
  }, []);

  //   useEffect(() => {
  //     console.log(recentlyModified);
  //   }, [recentlyModified]);

  return (
    <RecentScriptsContext.Provider value={{ recentlyModified }}>
      {children}
    </RecentScriptsContext.Provider>
  );
};

// Hook to use the RecentScriptsContext
export const useRecentScripts = (): RecentScriptsContextType => {
  const context = useContext(RecentScriptsContext);
  if (context === undefined) {
    throw new Error(
      "useRecentScripts must be used within a RecentScriptsProvider"
    );
  }
  return context;
};
