import Image from "next/image";

export default function GradientBackground() {
  return (
    <div className="fixed top-0 left-0 h-screen w-screen pointer-events-none">
      <div className="relative h-full w-full">
        {/* Bottom left blob with inline Safari-compatible styles */}
        <div
          className="absolute bg-brand rounded-full m-auto 
            h-[90vh] w-[90vh] left-[-45vh] bottom-[-45vh]
            sm:h-[110vh] sm:w-[110vh] sm:left-[-55vh] sm:bottom-[-55vh]
            md:h-[120vh] md:w-[120vh] md:left-[-60vh] md:bottom-[-60vh]
            lg:h-[130vh] lg:w-[130vh] lg:left-[-65vh] lg:bottom-[-65vh]
            opacity-70 sm:opacity-80 md:opacity-90 lg:opacity-100"
          style={{
            filter: "blur(45vh)",
            WebkitFilter: "blur(45vh)",
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)",
          }}
        ></div>

        {/* Top right blob with inline Safari-compatible styles */}
        <div
          className="absolute bg-brand rounded-full m-auto 
            h-[90vh] w-[90vh] right-[-45vh] top-[-45vh]
            sm:h-[110vh] sm:w-[110vh] sm:right-[-55vh] sm:top-[-55vh]
            md:h-[120vh] md:w-[120vh] md:right-[-60vh] md:top-[-60vh]
            lg:h-[130vh] lg:w-[130vh] lg:right-[-65vh] lg:top-[-65vh]
            opacity-70 sm:opacity-80 md:opacity-90 lg:opacity-100"
          style={{
            filter: "blur(45vh)",
            WebkitFilter: "blur(45vh)",
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)",
          }}
        ></div>

        {/* CSS for responsive blur adjustment */}
        <style jsx>{`
          @media (min-width: 640px) {
            div > div > div:nth-child(1) {
              filter: blur(60vh);
              -webkit-filter: blur(60vh);
            }
            div > div > div:nth-child(2) {
              filter: blur(60vh);
              -webkit-filter: blur(60vh);
            }
          }
          @media (min-width: 768px) {
            div > div > div:nth-child(1) {
              filter: blur(70vh);
              -webkit-filter: blur(70vh);
            }
            div > div > div:nth-child(2) {
              filter: blur(70vh);
              -webkit-filter: blur(70vh);
            }
          }
          @media (min-width: 1024px) {
            div > div > div:nth-child(1) {
              filter: blur(80vh);
              -webkit-filter: blur(80vh);
            }
            div > div > div:nth-child(2) {
              filter: blur(80vh);
              -webkit-filter: blur(80vh);
            }
          }
        `}</style>

        {/* <Image
          width={1534}
          height={824}
          alt="Noise layer"
          className="absolute w-full h-full left-0 top-0 opacity-5"
          src="https://utfs.io/a/dv6kwxfdfm/X7kJqL6j4LDUj3w2hVc0KnfVM2eQlBXcwWOxFPgdhCq8Eoz9"
        /> */}
      </div>
    </div>
  );
}
