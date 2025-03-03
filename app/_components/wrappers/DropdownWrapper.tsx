"use client";

import React, { useState, useRef, useEffect } from "react";
import OutsideClickHandler from "./OutsideClickHandler";
import DefaultDropdown from "../dropdowns/DefaultDropdown";

interface DropdownWrapperProps {
  dropdownType?: React.ComponentType<any>;
  metadata?: any;
  selected?: any;
  align?: "left" | "right";
  position?: "top" | "bottom";
  options: Array<{ text: string; onClick: () => void }>;
  isVisible?: boolean; // Made optional
  setIsVisible?: (value: boolean | ((prev: boolean) => boolean)) => void; // Made optional
  closeOnClick?: boolean;
  children: React.ReactNode;
  isActive?: boolean; // Added isActive
}

const DropdownWrapper: React.FC<DropdownWrapperProps> = ({
  dropdownType: DropdownType = DefaultDropdown,
  selected = [],
  metadata = {},
  align = "left",
  position = "bottom",
  options,
  isVisible: externalIsVisible,
  setIsVisible: externalSetIsVisible,
  closeOnClick = true,
  children,
  isActive = true, // Default to true
}) => {
  const [internalIsVisible, setInternalIsVisible] = useState<boolean>(false);
  const isVisible = externalIsVisible ?? internalIsVisible;
  const setIsVisible = externalSetIsVisible ?? setInternalIsVisible;

  const [shouldRender, setShouldRender] = useState<boolean>(isVisible);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = () => {
    if (isActive) setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    }
  }, [isVisible]);

  // If isActive is false, render children without functionality
  if (!isActive) {
    return <div className="relative">{children}</div>;
  }

  return (
    <div className="relative">
      <span
        ref={wrapperRef}
        onClick={() => isActive && setIsVisible((prev) => !prev)}
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
          metadata={metadata}
          selected={selected}
          options={options}
          align={align}
          position={position}
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
