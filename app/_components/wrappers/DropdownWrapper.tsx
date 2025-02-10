"use client";

import React, { useState, useRef, ReactNode } from "react";
import OutsideClickHandler from "./OutsideClickHandler";
import DefaultDropdown from "../dropdowns/DefaultDropdown";

const DropdownWrapper: any = ({
  dropdownType: DropdownType = DefaultDropdown,
  align = "left",
  options,
  children,
}: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = () => {
    setIsVisible(false);
  };

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
        {shouldRender && isVisible && (
          <DropdownType options={options} align={align} />
        )}
      </OutsideClickHandler>
    </div>
  );
};

export default DropdownWrapper;
