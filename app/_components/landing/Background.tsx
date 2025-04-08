export default function Background() {
  return (
    <div className="fixed top-0 left-0 h-screen w-screen pointer-events-none">
      <div className="relative h-full w-full">
        <div className="absolute bg-brand rounded-full m-auto h-[1000px] w-[1000px] left-[-500px] bottom-[-500px] blur-[600px]"></div>
        <div className="absolute bg-brand rounded-full m-auto h-[1000px] w-[1000px] right-[-500px] top-[-500px] blur-[600px]"></div>
        <img
          src="/landing/noiseLayer.png"
          className="absolute w-full h-full left-0 top-0 opacity-5"
        />
      </div>
    </div>
  );
}
