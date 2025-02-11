"use client";

import React, { useState, useRef, useEffect } from "react";
import OutsideClickHandler from "./OutsideClickHandler";
import DefaultDropdown from "../dropdowns/DefaultDropdown";

interface DropdownWrapperProps {
  dropdownType?: React.ComponentType<any>;
  align?: "left" | "right";
  options: Array<{ text: string; onClick: () => void }>;
  isVisible?: boolean; // Made optional
  setIsVisible?: (value: boolean | ((prev: boolean) => boolean)) => void; // Made optional
  closeOnClick?: boolean;
  children: React.ReactNode;
}

const DropdownWrapper: React.FC<DropdownWrapperProps> = ({
  dropdownType: DropdownType = DefaultDropdown,
  align = "left",
  options,
  isVisible: externalIsVisible,
  setIsVisible: externalSetIsVisible,
  closeOnClick = true,
  children,
}) => {
  const [internalIsVisible, setInternalIsVisible] = useState<boolean>(false);
  const isVisible = externalIsVisible ?? internalIsVisible;
  const setIsVisible = externalSetIsVisible ?? setInternalIsVisible;

  const [shouldRender, setShouldRender] = useState<boolean>(isVisible);
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
        onClick={() => setIsVisible((prev) => !prev)}
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
          setIsVisible={setIsVisible}
          shouldRender={shouldRender}
          setShouldRender={setShouldRender}
          closeOnClick={closeOnClick}
        />
      </OutsideClickHandler>
    </div>
  );
};

export default DropdownWrapper;
