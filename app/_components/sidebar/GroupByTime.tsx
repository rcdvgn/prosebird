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
    <div className="flex flex-col gap-8">
      {Object.entries(organizedInstances).map(([slot, group]: any) => (
        <div key={slot}>
          <span className="block font-semibold text-xs text-secondary mb-4">
            {capitalizeFirstLetter(slot)}
          </span>

          <div className="flex flex-col gap-4">
            {group.map((instance: any, index: number) => (
              <div key={index}>{children(instance, index)}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
