import { motion } from "framer-motion";

const DefaultDropdown = ({ options, align }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, translateY: -4 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -4 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={`absolute top-full mt-4 flex-col gap-1 min-w-48 p-1 bg-foreground rounded-[10px] ring-1 ring-stroke z-50 ${
        align === "right" ? "right-0" : "left-0"
      }`}
    >
      {options.map((item: any, index: any) => (
        <div
          key={index}
          onClick={item.onClick}
          className="px-3 py-2.5 rounded-md hover:bg-hover cursor-pointer font-bold text-[13px] text-inactive hover:text-primary"
        >
          {item.text}
        </div>
      ))}
    </motion.div>
  );
};

export default DefaultDropdown;
