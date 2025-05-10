"use client";

import { Google, Instagram, Reddit, TikTok, X } from "@/app/_assets/logos";

const Origin = ({ formData, setFormData }: any) => {
  const origins = [
    { name: "Google", logo: Google },
    { name: "Reddit", logo: Reddit },
    { name: "Instagram", logo: Instagram },
    { name: "TikTok", logo: TikTok },
    { name: "X", logo: X },
    { name: "Other" },
  ];

  const handleSelect = (name: string) => {
    setFormData((prev: any) => ({
      ...prev,
      origin: name,
    }));
  };

  const handleOtherChange = (e: any) => {
    setFormData((prev: any) => ({
      ...prev,
      otherOrigin: e.target.value,
    }));
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {origins.map((item, index) => {
        const isSelected = formData.origin === item.name;
        const Logo = item.logo ?? null;

        return (
          <div
            key={index}
            onClick={() => handleSelect(item.name)}
            className={`group cursor-pointer rounded-[14px] border-[1px] ${
              isSelected
                ? `border-transparent text-primary ${
                    item.name === "Other" ? "bg-battleground" : "bg-brand"
                  }`
                : "bg-background/30 hover:bg-hover border-stroke text-primary"
            }`}
          >
            <div className="w-full py-4 px-5 flex items-center gap-4">
              <div
                className={`h-4 w-4 rounded-full p-[2px] border-[1px] ${
                  isSelected ? "border-primary" : "border-secondary"
                }`}
              >
                <div
                  className={`w-full h-full rounded-full ${
                    isSelected ? "bg-primary" : ""
                  }`}
                ></div>
              </div>

              <div className="flex items-center gap-3">
                {Logo && <Logo className="w-4" />}
                <span className="font-semibold text-sm">{item.name}</span>
              </div>
            </div>

            {isSelected && item.name === "Other" && (
              <div className="w-full pb-4 pt-2 px-5">
                <input
                  value={formData.otherOrigin}
                  onChange={handleOtherChange}
                  placeholder="Please specify"
                  type="text"
                  className="input-default w-full !bg-background"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Origin;
