import { motion } from "framer-motion";
import ProfilePicture from "../ProfilePicture";
import { AddUserIcon, CheckIcon, CircledCheckIcon } from "@/app/_assets/icons";
import { useModal } from "@/app/_contexts/ModalContext";
import AddGuest from "../modals/AddGuest";

const SimpleSelectedDropdown = ({
  metadata,
  optionGroups,
  selected,
  align,
  position,
  isVisible,
  setIsVisible,
  shouldRender,
  setShouldRender,
  closeOnClick,
}: any) => {
  const handleClick = (func: any) => {
    func();
    closeOnClick ? setIsVisible(false) : "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, translateY: position === "bottom" ? -4 : 4 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        translateY: isVisible ? 0 : position === "bottom" ? -4 : 4,
      }}
      exit={{ opacity: 0, translateY: position === "bottom" ? -4 : 4 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (!isVisible) setShouldRender(false);
      }}
      spellCheck="false"
      className={`absolute flex-col gap-1 w-36 p-1.5 bg-battleground border-[1px] border-border rounded-[10px] ring-1 ring-stroke z-50 cursor-default ${
        align === "right" ? "right-0" : "left-0"
      } ${position === "bottom" ? "mt-4 top-full" : "mb-4 bottom-full"} ${
        shouldRender ? "flex" : "hidden"
      }`}
    >
      {optionGroups[0].map((item: any, index: any) => (
        <div
          key={index}
          onClick={() => handleClick(item.onClick)}
          className={`flex gap-2.5 items-center px-2 h-9 rounded-lg cursor-pointer hover:bg-hover ${
            selected.includes(index)
              ? "text-primary"
              : "text-inactive hover:text-primary"
          }`}
        >
          <span className="p-1">
            <CheckIcon
              className={`h-2 ${
                selected.includes(index) ? "text-brand" : "text-transparent"
              }`}
            />
          </span>
          <span className="font-semibold text-sm">{item.text}</span>
        </div>
      ))}

      <div className="w-full h-[1px] bg-border"></div>

      {optionGroups[1].map((item: any, index: any) => (
        <div
          key={index}
          onClick={() => handleClick(item.onClick)}
          className={`flex gap-2.5 items-center px-2 h-9 rounded-lg cursor-pointer hover:bg-hover ${
            selected.includes(index)
              ? "text-primary"
              : "text-inactive hover:text-primary"
          }`}
        >
          <span className="font-semibold text-sm">{item.text}</span>
        </div>
      ))}
    </motion.div>
  );
};

export default SimpleSelectedDropdown;
