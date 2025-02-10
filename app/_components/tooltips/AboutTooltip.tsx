import { forwardRef } from "react";

const AboutTooltip = forwardRef<HTMLDivElement, any>(
  ({ data, className, style }, ref) => (
    <div ref={ref} className={`tooltip-about ${className}`} style={style}>
      {data.text}
    </div>
  )
);

export default AboutTooltip;
