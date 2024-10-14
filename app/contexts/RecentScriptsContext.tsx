import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { subscribeToRecentScripts } from "../actions/actions"; // Import the action

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
    // Subscribe to recent scripts using the action function
    const unsubscribe = subscribeToRecentScripts((recentScripts: Script[]) => {
      setRecentlyModified(recentScripts);
    });

    // Cleanup the listener when the component unmounts
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
