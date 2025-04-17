"use client";

import StandaloneLogo from "@/app/_assets/StandaloneLogo";
import { PrimaryLogo } from "@/app/_assets/logos";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar({
  scrollContainerRef,
  featuresRef,
  editorRef,
  collaborationRef,
  faqRef,
  scrollToSection,
}: any) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollPosition = scrollContainer.scrollTop;
      if (scrollPosition > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [scrollContainerRef]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 820 && menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [menuOpen]);

  const handleNavClick = (ref: any) => {
    scrollToSection(ref);
    setMenuOpen(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setMenuOpen(false);
    }
  };

  return (
    <>
      <div className="z-30 fixed top-0 h-24 w-full flex justify-center items-center">
        <div
          className={`w-[95%] max-w-[1080px] transition-all duration-300 ease-in-out h-16 flex items-center justify-between px-7 rounded-[20px] border-[1px] ${
            scrolled
              ? "backdrop-blur-lg bg-middleground/50 border-stroke"
              : "border-transparent"
          }`}
        >
          <div className="max-[360px]:hidden flex items-center gap-3">
            <PrimaryLogo className="h-6" />

            <div className="rounded-full px-2.5 py-1 ring-1 ring-brand/35 bg-gradient-to-r from-brand/20 to-blue-700/20 font-bold text-[11px] text-brand cursor-default">
              Early access
            </div>
          </div>

          <span className="min-[361px]:hidden">
            <StandaloneLogo className="h-6" />
          </span>

          <div className="max-[820px]:hidden flex items-center gap-10">
            <span
              onClick={() => scrollToSection(featuresRef)}
              className="text-inactive font-bold text-sm cursor-pointer hover:text-primary px-1"
            >
              Telemprompter
            </span>

            <span
              onClick={() => scrollToSection(editorRef)}
              className="text-inactive font-bold text-sm cursor-pointer hover:text-primary px-1"
            >
              Script Editor
            </span>

            <span
              onClick={() => scrollToSection(collaborationRef)}
              className="text-inactive font-bold text-sm cursor-pointer hover:text-primary px-1"
            >
              Collaboration
            </span>

            <span
              onClick={() => scrollToSection(faqRef)}
              className="text-inactive font-bold text-sm cursor-pointer hover:text-primary px-1"
            >
              FAQ
            </span>
          </div>

          {/* Mobile menu button */}
          <button
            className="group min-[820px]:hidden flex justify-center items-center w-8 h-8"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu
              size={24}
              className="group-hover:text-primary text-inactive"
            />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background flex flex-col"
          onClick={handleBackdropClick}
        >
          <div className="h-24 w-full flex justify-between items-center px-7">
            <div className="flex items-center gap-3">
              <PrimaryLogo className="h-6" />

              <div className="rounded-full px-2.5 py-1 ring-1 ring-brand/35 bg-gradient-to-r from-brand/20 to-blue-700/20 font-bold text-[11px] text-brand cursor-default">
                Early access
              </div>
            </div>

            <button
              className="group flex justify-center items-center w-8 h-8"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} className="group-hover:text-primary text-inactive" />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 gap-10">
            <span
              onClick={() => handleNavClick(featuresRef)}
              className="hover:translate-x-1.5 transition-all duration-200 ease-in-out hover:text-primary text-inactive font-bold text-2xl cursor-pointer px-1"
            >
              Telemprompter
            </span>

            <span
              onClick={() => handleNavClick(editorRef)}
              className="hover:translate-x-1.5 transition-all duration-200 ease-in-out hover:text-primary text-inactive font-bold text-2xl cursor-pointer px-1"
            >
              Script Editor
            </span>

            <span
              onClick={() => handleNavClick(collaborationRef)}
              className="hover:translate-x-1.5 transition-all duration-200 ease-in-out hover:text-primary text-inactive font-bold text-2xl cursor-pointer px-1"
            >
              Collaboration
            </span>

            <span
              onClick={() => handleNavClick(faqRef)}
              className="hover:translate-x-1.5 transition-all duration-200 ease-in-out hover:text-primary text-inactive font-bold text-2xl cursor-pointer px-1"
            >
              FAQ
            </span>
          </div>
        </div>
      )}
    </>
  );
}
