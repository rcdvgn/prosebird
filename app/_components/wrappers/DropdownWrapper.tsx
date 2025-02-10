import React, { useState, useRef, ReactNode } from "react";
import { motion } from "framer-motion";
import OutsideClickHandler from "./OutsideClickHandler";

interface DropdownOption {
  text: string;
  value: any;
}

interface DropdownWrapperProps {
  dropdownType?: React.FC<DropdownProps>;
  align?: "left" | "right";
  onClick?: (value: any) => void;
  data: DropdownOption[];
  children: ReactNode;
}

interface DropdownProps {
  options: DropdownOption[];
  onOptionClick: (value: any) => void;
  align: "left" | "right";
}

const DefaultDropdown: React.FC<DropdownProps> = ({
  options,
  onOptionClick,
  align,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, translateY: -4 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -4 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={`absolute top-full mt-2 min-w-48 bg-foreground rounded-[10px] ring-1 ring-stroke z-[9999] p-1 ${
        align === "right" ? "right-0" : "left-0"
      }`}
    >
      {options.map((item, index) => (
        <div
          key={index}
          onClick={() => onOptionClick(item.value)}
          className="px-3 py-2.5 rounded-md hover:bg-hover cursor-pointer font-bold text-[13px] text-inactive hover:text-primary"
        >
          {item.text}
        </div>
      ))}
    </motion.div>
  );
};

const DropdownWrapper: React.FC<DropdownWrapperProps> = ({
  dropdownType: DropdownType = DefaultDropdown,
  align = "left",
  onClick,
  data,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = () => {
    setIsVisible(false);
  };

  const handleOptionClick = (value: any) => {
    if (onClick) onClick(value);
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
          <DropdownType
            options={data}
            onOptionClick={handleOptionClick}
            align={align}
          />
        )}
      </OutsideClickHandler>
    </div>
  );
};

export default DropdownWrapper;
