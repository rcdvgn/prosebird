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
import Features from "@/app/_components/landing/Features";
import Purpose from "./_components/landing/Purpose";
import Reasoning from "./_components/landing/Reasoning";

export default function LandingPage() {
  const scrollContainerRef = useRef<any>(null);

  const [success, setSuccess] = useState<any>("");
  const [loading, setLoading] = useState<any>(false);

  const featuresRef = useRef(null);
  const editorRef = useRef(null);
  const collaborationRef = useRef(null);
  const faqRef = useRef(null);

  const scrollToSection = (elementRef: any) => {
    if (elementRef.current && scrollContainerRef.current) {
      const containerRect = scrollContainerRef.current.getBoundingClientRect();
      const elementRect = elementRef.current.getBoundingClientRect();

      const relativeTop =
        elementRect.top -
        containerRect.top +
        scrollContainerRef.current.scrollTop;

      scrollContainerRef.current.scrollTo({
        top: relativeTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className="relative overflow-y-auto w-screen h-screen bg-middleground flex items-start justify-center overflow-x-hidden"
    >
      <Background />
      <div className="relative w-full">
        <Navbar
          scrollContainerRef={scrollContainerRef}
          featuresRef={featuresRef}
          editorRef={editorRef}
          collaborationRef={collaborationRef}
          faqRef={faqRef}
          scrollToSection={scrollToSection}
        />

        <Hero
          scrollContainerRef={scrollContainerRef}
          success={success}
          setSuccess={setSuccess}
          loading={loading}
          setLoading={setLoading}
        />
        <Presentation />
        <Purpose />
        <Reasoning scrollContainerRef={scrollContainerRef} />
        <Features featuresRef={featuresRef} />
        <Benefits />
        <Editor editorRef={editorRef} />
        <UseCases />
        <Collaboration collaborationRef={collaborationRef} />
        <Faq faqRef={faqRef} />
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
