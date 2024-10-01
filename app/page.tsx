// app/page.tsx
"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user } = useAuth(); // This will correctly destructure the user
  const router = useRouter();

  useEffect(() => {
    console.log(user); // This should now log the correct user object
    if (user) {
      router.push("/files");
    }
  }, [user, router]);

  return <div>Welcome to the homepage!</div>;
}
