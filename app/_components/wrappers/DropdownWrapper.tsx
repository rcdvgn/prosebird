"use client";

import React, { useState, useRef, useEffect } from "react";
import OutsideClickHandler from "./OutsideClickHandler";
import DefaultDropdown from "../dropdowns/DefaultDropdown";

interface DropdownWrapperProps {
  dropdownType?: React.ComponentType<any>;
  align?: "left" | "right";
  options: Array<{ text: string; onClick: () => void }>;
  isVisible: boolean;
  setIsVisible: (value: boolean | ((prev: boolean) => boolean)) => void;
  children: React.ReactNode;
}

const DropdownWrapper: any = ({
  dropdownType: DropdownType = DefaultDropdown,
  align = "left",
  options,
  isVisible,
  setIsVisible,
  children,
}: DropdownWrapperProps) => {
  const [shouldRender, setShouldRender] = useState<any>(isVisible);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    }
  }, [isVisible]);

  return (
    <div className="relative">
      <span
        ref={wrapperRef}
        onClick={() => setIsVisible((prev: any) => !prev)}
        className="block"
      >
        {children}
      </span>

      <OutsideClickHandler
        onOutsideClick={handleOutsideClick}
        exceptionRefs={[wrapperRef]}
        isActive={isVisible}
      >
        <DropdownType
          options={options}
          align={align}
          isVisible={isVisible}
          shouldRender={shouldRender}
          setShouldRender={setShouldRender}
        />
      </OutsideClickHandler>
    </div>
  );
};

export default DropdownWrapper;
