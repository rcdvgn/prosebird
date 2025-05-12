import React from "react";

export default function AuthContainer({
  children,
  title,
  description,
  error,
}: any) {
  return (
    <div className="max-sm:h-full sm:max-w-[465px] min-h-[650px] sm:rounded-2xl z-10 bg-background border-stroke border-[1px] pb-10 w-full mx-auto overflow-hidden flex flex-col items-center justify-center">
      {error && (
        <div className="text-center w-full py-1.5 bg-red-900">
          <span className="text-primary text-[13px] font-medium">{error}</span>
        </div>
      )}

      <div className="px-6 sm:px-8 my-8 flex flex-col gap-6 items-center">
        <img
          className="h-9 !aspect-square"
          src="https://utfs.io/a/dv6kwxfdfm/X7kJqL6j4LDUlNtWPnomHUs49zRpMfonbdO3FGlh8Be6YKQ0"
          alt="Logo"
        />
        <div className="text-center">
          <span className="block font-bold text-primary text-3xl mb-2">
            {title}
          </span>
          {description &&
            (typeof description === "string" ? (
              <div className="">
                <span className="text-sm font-semibold text-secondary">
                  {description}
                </span>
              </div>
            ) : (
              description
            ))}
        </div>
      </div>

      {children}
    </div>
  );
}
