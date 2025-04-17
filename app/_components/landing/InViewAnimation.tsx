import React from "react";
import { motion, useInView } from "framer-motion";

// Reusable InViewAnimation component
export default function InViewAnimation({
  children,
  className,
  delay = 0,
  margin = "200px",
  triggerOnce = true,
  scale = true,
  y = true,
  duration = 0.5,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  margin?: string;
  triggerOnce?: boolean;
  scale?: boolean;
  y?: boolean;
  duration?: number;
}) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, {
    once: triggerOnce,
    margin: margin as any,
  });

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: y ? 40 : 0,
      scale: scale ? 0.9 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: duration,
        ease: "easeOut",
        delay: delay,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
}
