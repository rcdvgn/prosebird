import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Background() {
  const bottomBlobRef = useRef(null);
  const topBlobRef = useRef(null);

  // Apply Safari-compatible CSS after mount
  useEffect(() => {
    if (bottomBlobRef.current && topBlobRef.current) {
      // Apply direct CSS styles for Safari compatibility
      const applyBlobStyles = (element: any, size: any) => {
        element.style.filter = `blur(${size}vh)`;
        element.style.WebkitFilter = `blur(${size}vh)`;
        // Force hardware acceleration
        element.style.transform = "translateZ(0)";
        element.style.WebkitTransform = "translateZ(0)";
      };

      // Apply styles with size based on viewport
      const blurSize =
        window.innerWidth < 640
          ? 45
          : window.innerWidth < 768
          ? 60
          : window.innerWidth < 1024
          ? 70
          : 80;

      applyBlobStyles(bottomBlobRef.current, blurSize);
      applyBlobStyles(topBlobRef.current, blurSize);
    }
  }, []);

  return (
    <div className="fixed top-0 left-0 h-screen w-screen pointer-events-none">
      <div className="relative h-full w-full">
        {/* Bottom left blob with Safari fallback */}
        <div
          ref={bottomBlobRef}
          className="absolute bg-brand rounded-full m-auto 
            h-[90vh] w-[90vh] left-[-45vh] bottom-[-45vh]
            sm:h-[110vh] sm:w-[110vh] sm:left-[-55vh] sm:bottom-[-55vh]
            md:h-[120vh] md:w-[120vh] md:left-[-60vh] md:bottom-[-60vh]
            lg:h-[130vh] lg:w-[130vh] lg:left-[-65vh] lg:bottom-[-65vh]
            opacity-70 sm:opacity-80 md:opacity-90 lg:opacity-100"
          // The blur class is intentionally removed as we're applying it via JS for Safari compatibility
        ></div>

        {/* Top right blob with Safari fallback */}
        <div
          ref={topBlobRef}
          className="absolute bg-brand rounded-full m-auto 
            h-[90vh] w-[90vh] right-[-45vh] top-[-45vh]
            sm:h-[110vh] sm:w-[110vh] sm:right-[-55vh] sm:top-[-55vh]
            md:h-[120vh] md:w-[120vh] md:right-[-60vh] md:top-[-60vh]
            lg:h-[130vh] lg:w-[130vh] lg:right-[-65vh] lg:top-[-65vh]
            opacity-70 sm:opacity-80 md:opacity-90 lg:opacity-100"
          // The blur class is intentionally removed as we're applying it via JS for Safari compatibility
        ></div>

        <Image
          width={1534}
          height={824}
          alt="Noise layer"
          className="absolute w-full h-full left-0 top-0 opacity-5"
          src="https://utfs.io/a/dv6kwxfdfm/X7kJqL6j4LDUj3w2hVc0KnfVM2eQlBXcwWOxFPgdhCq8Eoz9"
        />
      </div>
    </div>
  );
}
