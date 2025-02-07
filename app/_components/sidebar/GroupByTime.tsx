import React from "react";
import { groupInstancesByTime } from "../../_utils/groupInstancesByTime"; // adjust the path as needed
import capitalizeFirstLetter from "../../_utils/capitalizeFirstLetter";

interface GroupByTimeProps {
  unorganizedInstances: any[];
  criteria: string;
  children: (instance: any, index: number) => JSX.Element;
}

export const GroupByTime: React.FC<GroupByTimeProps> = ({
  unorganizedInstances,
  criteria,
  children,
}) => {
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
