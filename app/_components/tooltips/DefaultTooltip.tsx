"use client";

import { forwardRef } from "react";

const DefaultTooltip = forwardRef<HTMLDivElement, any>(
  ({ data, className, style }, ref) => (
    <div ref={ref} className={`tooltip-default ${className}`} style={style}>
      {data.text}
    </div>
  )
);

export default DefaultTooltip;
