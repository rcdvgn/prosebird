import Collaboration from "@/app/_components/landing/Collaboration";
import Faq from "@/app/_components/landing/Faq";
import Hero from "@/app/_components/landing/Hero";
import Navbar from "@/app/_components/landing/Navbar";
import Presentation from "@/app/_components/landing/Presentation";
import React from "react";

export default function LandingPage() {
  return (
    <div className="overflow-y-auto w-screen h-screen bg-middleground flex items-start justify-center">
      <div className="relative w-[1080px]">
        <Navbar />

        <Hero />
        <Presentation />
        <Collaboration />
        <Faq />
      </div>
    </div>
  );
}
