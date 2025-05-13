import React from "react";
import { groupInstancesByTime } from "../../_utils/groupInstancesByTime"; // adjust the path as needed
import capitalizeFirstLetter from "../../_utils/capitalizeFirstLetter";

export const GroupByTime = ({
  unorganizedInstances,
  criteria,
  children,
}: any) => {
  const organizedInstances = groupInstancesByTime(
    unorganizedInstances,
    criteria
  );

  return (
    <div className="flex flex-col gap-4 overflow-y-auto grow no-scrollbar">
      {Object.entries(organizedInstances).map(([slot, group]: any) => (
        <div
          className="flex flex-col items-center @[80px]:items-start"
          key={slot}
        >
          <span className="text-center @[80px]:text-left block font-semibold text-xs text-primary mb-2.5 @[80px]:px-4 py-1">
            {capitalizeFirstLetter(slot)}
          </span>

          <div className="flex flex-col gap-1 w-10 @[80px]:w-full">
            {group.map((instance: any, index: number) => (
              <div key={index}>{children(instance, index)}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
