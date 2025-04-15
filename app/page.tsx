"use client";

import Background from "@/app/_components/landing/Background";
import Benefits from "@/app/_components/landing/Benefits";
import Collaboration from "@/app/_components/landing/Collaboration";
import Editor from "@/app/_components/landing/Editor";
import Faq from "@/app/_components/landing/Faq";
import Footer from "@/app/_components/landing/Footer";
import Hero from "@/app/_components/landing/Hero";
import Navbar from "@/app/_components/landing/Navbar";
import Presentation from "@/app/_components/landing/Presentation";
import UseCases from "@/app/_components/landing/UseCases";
import React, { useRef, useState } from "react";

export default function LandingPage() {
  const scrollContainerRef = useRef<any>(null);

  const [success, setSuccess] = useState<any>("");
  const [loading, setLoading] = useState<any>(false);

  return (
    <div
      ref={scrollContainerRef}
      className="relative overflow-y-auto w-screen h-screen bg-middleground flex items-start justify-center overflow-x-hidden"
    >
      <Background />
      <div className="relative w-full">
        <Navbar scrollContainerRef={scrollContainerRef} />

        <Hero
          scrollContainerRef={scrollContainerRef}
          success={success}
          setSuccess={setSuccess}
          loading={loading}
          setLoading={setLoading}
        />
        <Presentation />
        <Benefits />
        <Editor />
        <UseCases />
        <Collaboration />
        <Faq />
        <Footer
          success={success}
          setSuccess={setSuccess}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
}
