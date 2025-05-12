"use client";

import {
  UseCasesAcademicIcon,
  UseCasesPersonalIcon,
  UseCasesProfessionalIcon,
} from "@/app/_assets/icons";
import { useEffect } from "react";

const UserType = ({ formData, setFormData, error }: any) => {
  const userTypes = [
    {
      title: "Academic",
      desc: "For school, university, or teaching.",
      icon: (filled: boolean) => (
        <UseCasesAcademicIcon className="h-4" filled={filled} />
      ),
    },
    {
      title: "Professional",
      desc: "For work, business, or career material.",
      icon: (filled: boolean) => (
        <UseCasesProfessionalIcon className="h-4" filled={filled} />
      ),
    },
    {
      title: "Personal",
      desc: "For creative or personal projects.",
      icon: (filled: boolean) => (
        <UseCasesPersonalIcon className="w-4" filled={filled} />
      ),
    },
  ];

  const handleSelect = (title: string) => {
    setFormData((prev: any) => ({
      ...prev,
      userType: title,
    }));
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {userTypes.map((item, index) => {
        const isActive = formData.userType === item?.title;

        return (
          <div
            key={index}
            onClick={() => handleSelect(item.title)}
            className={`group w-full py-4 px-5 rounded-[20px] flex items-center gap-6 border-[1px] cursor-pointer ${
              isActive
                ? "bg-brand/15 border-brand/20"
                : "bg-foreground border-stroke hover:bg-hover"
            }`}
          >
            <div
              className={`h-12 aspect-square rounded-[14px] grid place-items-center ${
                isActive
                  ? "bg-brand text-primary"
                  : "bg-battleground text-primary"
              }`}
            >
              {item.icon(isActive)}
            </div>

            <div className="flex flex-col gap-1">
              <span className={`block font-bold text-base text-primary`}>
                {item.title}
              </span>
              <span className="block font-semibold text-sm text-secondary">
                {item.desc}
              </span>
            </div>
          </div>
        );
      })}

      {error?.userType && (
        <span className="text-xs text-red-500 font-medium my-4 px-1 block">
          {error.userType}
        </span>
      )}
    </div>
  );
};

export default UserType;
