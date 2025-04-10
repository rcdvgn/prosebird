import React from "react";
import Cta from "./Cta";
import { PrimaryLogo } from "@/app/_assets/logos";

export default function Footer({
  success,
  setSuccess,
  loading,
  setLoading,
}: any) {
  return (
    <div className="w-full min-h-screen flex justify-center items-start pt-72 pb-12">
      <div className="w-[1080px]">
        <div className="flex flex-col items-center mb-32">
          <span className="text-3xl font-bold text-primary mb-4">
            Available soon
          </span>

          <Cta
            success={success}
            setSuccess={setSuccess}
            loading={loading}
            setLoading={setLoading}
          />
        </div>

        <div className="flex flex-col gap-6 text-center">
          <PrimaryLogo className="h-7" />
          <span className="text-secondary font-semibold text-sm">
            © {new Date().getFullYear()} ProseBird. All rights reserved.
          </span>
        </div>
      </div>
    </div>
  );
}
