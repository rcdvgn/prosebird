import Image from "next/image";

export default function Background() {
  return (
    <div className="fixed top-0 left-0 h-screen w-screen pointer-events-none">
      <div className="relative h-full w-full">
        <div className="absolute bg-brand rounded-full m-auto h-[1000px] w-[1000px] left-[-500px] bottom-[-500px] blur-[600px]"></div>
        <div className="absolute bg-brand rounded-full m-auto h-[1000px] w-[1000px] right-[-500px] top-[-500px] blur-[600px]"></div>

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
