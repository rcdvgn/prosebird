import Image from "next/image";

export default function Background() {
  return (
    <div className="fixed top-0 left-0 h-screen w-screen pointer-events-none">
      <div className="relative h-full w-full">
        {/* Bottom left blob with responsive sizing and blur */}
        <div
          className="absolute bg-brand rounded-full m-auto 
          h-[90vh] w-[90vh] left-[-45vh] bottom-[-45vh] blur-[45vh]
          sm:h-[110vh] sm:w-[110vh] sm:left-[-55vh] sm:bottom-[-55vh] sm:blur-[60vh]
          md:h-[120vh] md:w-[120vh] md:left-[-60vh] md:bottom-[-60vh] md:blur-[70vh]
          lg:h-[130vh] lg:w-[130vh] lg:left-[-65vh] lg:bottom-[-65vh] lg:blur-[80vh]
          opacity-70 sm:opacity-80 md:opacity-90 lg:opacity-100"
        ></div>

        {/* Top right blob with responsive sizing and blur */}
        <div
          className="absolute bg-brand rounded-full m-auto 
          h-[90vh] w-[90vh] right-[-45vh] top-[-45vh] blur-[45vh]
          sm:h-[110vh] sm:w-[110vh] sm:right-[-55vh] sm:top-[-55vh] sm:blur-[60vh]
          md:h-[120vh] md:w-[120vh] md:right-[-60vh] md:top-[-60vh] md:blur-[70vh]
          lg:h-[130vh] lg:w-[130vh] lg:right-[-65vh] lg:top-[-65vh] lg:blur-[80vh]
          opacity-70 sm:opacity-80 md:opacity-90 lg:opacity-100"
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
