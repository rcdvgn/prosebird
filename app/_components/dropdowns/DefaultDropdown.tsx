import { motion } from "framer-motion";

const DefaultDropdown = ({
  optionGroups,
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
      className={`absolute flex-col gap-1 min-w-48 p-1 bg-foreground rounded-[10px] ring-1 ring-stroke z-50 ${
        align === "right" ? "right-0" : "left-0"
      } ${position === "bottom" ? "mt-4 top-full" : "mb-4 bottom-full"} ${
        shouldRender ? "flex" : "hidden"
      }`}
    >
      {optionGroups[0].map((item: any, index: any) => (
        <div
          key={index}
          onClick={() => handleClick(item.onClick)}
          className="px-3 py-2.5 rounded-md hover:bg-hover cursor-pointer font-semibold text-[13px] text-inactive hover:text-primary"
        >
          {item.text}
        </div>
      ))}

      {/* <div className="w-full h-[1px] bg-border"></div>

      {optionGroups[1].map((item: any, index: any) => (
        <div
          key={index}
          className={``}
        >
          <span className="">{item.text}</span>
        </div>
      ))} */}
    </motion.div>
  );
};

export default DefaultDropdown;
