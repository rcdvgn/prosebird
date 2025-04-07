import { PrimaryLogo } from "@/app/_assets/logos";

export default function Navbar() {
  return (
    <div className="z-10 sticky top-0 py-5">
      <div className="backdrop-blur-lg h-16 flex items-center justify-between px-7 rounded-[20px] bg-middleground/80 border-stroke border-[1px]">
        <div className="flex items-center gap-3">
          <PrimaryLogo className="h-5" />

          <div className="rounded-full px-2.5 py-1.5 ring-1 ring-brand/35 bg-gradient-to-r from-brand/20 to-blue-700/20 font-bold text-xs text-brand">
            Pre-launch
          </div>
        </div>

        <div className="flex items-center gap-7">
          <span className="text-inactive font-bold text-sm cursor-pointer hover:text-primary">
            Presentation
          </span>

          <span className="text-inactive font-bold text-sm cursor-pointer hover:text-primary">
            Benefits
          </span>

          <span className="text-inactive font-bold text-sm cursor-pointer hover:text-primary">
            Script Editor
          </span>

          <span className="text-inactive font-bold text-sm cursor-pointer hover:text-primary">
            Collaboration
          </span>

          <span className="text-inactive font-bold text-sm cursor-pointer hover:text-primary">
            FAQ
          </span>
        </div>
      </div>
    </div>
  );
}
