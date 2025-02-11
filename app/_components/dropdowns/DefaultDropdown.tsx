import { motion } from "framer-motion";

const DefaultDropdown = ({
  options,
  align,
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
      initial={{ opacity: 0, translateY: -4 }}
      animate={{ opacity: isVisible ? 1 : 0, translateY: isVisible ? 0 : -4 }}
      exit={{ opacity: 0, translateY: -4 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (!isVisible) setShouldRender(false);
      }}
      className={`absolute top-full mt-4 flex-col gap-1 min-w-48 p-1 bg-foreground rounded-[10px] ring-1 ring-stroke z-50 ${
        align === "right" ? "right-0" : "left-0"
      } ${shouldRender ? "flex" : "hidden"}`}
    >
      {options.map((item: any, index: any) => (
        <div
          key={index}
          onClick={() => handleClick(item.onClick)}
          className="px-3 py-2.5 rounded-md hover:bg-hover cursor-pointer font-semibold text-[13px] text-inactive hover:text-primary"
        >
          {item.text}
        </div>
      ))}
    </motion.div>
  );
};

export default DefaultDropdown;
