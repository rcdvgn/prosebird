import React from "react";
import Cta from "./Cta";
import { PrimaryLogo } from "@/app/_assets/logos";
import InViewAnimation from "./InViewAnimation";

export default function Footer({
  success,
  setSuccess,
  loading,
  setLoading,
}: any) {
  return (
    <div className="w-full h-screen flex justify-center items-stretch py-10">
      <div className="w-[1080px] h-full flex flex-col items-center justify-between">
        <div className="invisible flex flex-col gap-4 text-center">
          <PrimaryLogo className="h-7" />
          <span className="text-secondary font-semibold text-sm">
            © {new Date().getFullYear()} ProseBird. All rights reserved.
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-primary mb-4 select-none">
            What would you like to say today?
          </span>

          <Cta
            success={success}
            setSuccess={setSuccess}
            loading={loading}
            setLoading={setLoading}
          />
        </div>

        <div className="flex flex-col gap-4 text-center">
          <PrimaryLogo className="h-7" />
          <span className="text-secondary font-semibold text-sm">
            © {new Date().getFullYear()} ProseBird. All rights reserved.
          </span>
        </div>
      </div>
    </div>
  );
}
