import { motion } from "framer-motion";
import ProfilePicture from "../ProfilePicture";
import { AddUserIcon } from "@/app/_assets/icons";
import { useModal } from "@/app/_contexts/ModalContext";
import AddGuest from "../modals/AddGuest";

const AssignChapterDropdown = ({
  metadata,
  options,
  selected,
  align,
  position,
  isVisible,
  setIsVisible,
  shouldRender,
  setShouldRender,
  closeOnClick,
}: any) => {
  const { openModal } = useModal();

  const handleClick = (func: any) => {
    func();
    closeOnClick ? setIsVisible(false) : "";
  };

  const handleAddGuestModal = () => {
    openModal({
      content: <AddGuest metadata={metadata} />,
      name: "addGuest",
    });
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
      className={`absolute flex-col gap-1 w-56 p-1.5 bg-foreground rounded-[10px] ring-1 ring-stroke z-50 cursor-default ${
        align === "right" ? "right-0" : "left-0"
      } ${position === "bottom" ? "mt-4 top-full" : "mb-4 bottom-full"} ${
        shouldRender ? "flex" : "hidden"
      }`}
    >
      <div className="flex justify-between items-center px-2 py-1.5">
        <div className="flex gap-1.5 items-center">
          <span className="text-[13px] text-secondary font-medium">
            Speakers
          </span>
          <span className="h-5 aspect-square rounded-[4px] bg-selected grid place-items-center font-bold text-xs text-secondary">
            {options.length}
          </span>
        </div>
        <span
          onClick={handleAddGuestModal}
          className="h-full aspect-square grid place-items-center !bg-transparent text-inactive hover:text-primary cursor-pointer"
        >
          <AddUserIcon className="h-3.5" />
        </span>
      </div>
      {options.map((item: any, index: any) => (
        <div
          key={index}
          onClick={() => handleClick(item.onClick)}
          className={`flex gap-2.5 items-center px-2 py-1.5 rounded-lg cursor-pointer ${
            selected.includes(index)
              ? "bg-brand text-primary"
              : "text-inactive hover:text-primary hover:bg-hover"
          }`}
        >
          {item.profilePicture}
          <span className="font-semibold text-[13px]">{item.text}</span>
        </div>
      ))}
    </motion.div>
  );
};

export default AssignChapterDropdown;
