"use client";

import Background from "@/app/_components/landing/Background";
import Collaboration from "@/app/_components/landing/Collaboration";
import Editor from "@/app/_components/landing/Editor";
import Faq from "@/app/_components/landing/Faq";
import Footer from "@/app/_components/landing/Footer";
import Hero from "@/app/_components/landing/Hero";
import Navbar from "@/app/_components/landing/Navbar";
import Presentation from "@/app/_components/landing/Presentation";
import React, { useRef } from "react";

export default function LandingPage() {
  const scrollContainerRef = useRef<any>(null);

  return (
    <div
      ref={scrollContainerRef}
      className="relative overflow-y-auto w-screen h-screen bg-middleground flex items-start justify-center landing-page"
    >
      <Background />
      <div className="relative w-full">
        <Navbar scrollContainerRef={scrollContainerRef} />

        <Hero scrollContainerRef={scrollContainerRef} />
        <Presentation />
        <Editor />
        <Collaboration />
        <Faq />
        <Footer />
      </div>
    </div>
  );
}
