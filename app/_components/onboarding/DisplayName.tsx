"use client";

import { useEffect } from "react";
import OnboardingContainer from "../containers/OnboardingContainer";
import { XDeleteIcon } from "@/app/_assets/icons";

const DisplayName = ({ formData, setFormData, error }: any) => {
  const handleChange = (e: any) => {
    const newDisplayName = e.target.value;
    setFormData((prev: any) => ({
      ...prev,
      displayName: newDisplayName,
    }));
  };

  const clearDisplayName = () =>
    setFormData((prev: any) => ({
      ...prev,
      displayName: "",
    }));

  return (
    <div className="w-full">
      <div className="h-12 w-full flex items-center border-b-2 transition-colors duration-100 border-border focus-within:border-brand">
        <input
          value={formData.displayName}
          onChange={handleChange}
          type="text"
          spellCheck={false}
          maxLength={30}
          className="bg-transparent border-none rounded-none outline-none placeholder:text-placeholder text-primary text-lg font-semibold grow h-full px-3"
          placeholder="E.g. John Doe"
        />

        {formData.displayName.length > 0 && (
          <span
            onClick={clearDisplayName}
            className="button-icon shrink-0 !bg-transparent"
          >
            <XDeleteIcon className="h-3" />
          </span>
        )}
      </div>

      <span className="text-xs text-tertiary font-medium my-2 px-1 block">
        {formData.displayName.length}/30
      </span>

      {error?.displayName && (
        <span className="text-xs text-red-500 font-medium my-4 px-1 block">
          {error.displayName}
        </span>
      )}
    </div>
  );
};

export default DisplayName;
