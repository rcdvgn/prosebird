import React from "react";
// import DropdownWrapper from "../wrappers/DropdownWrapper";
import DropdownWrapper from "../testDropdown/DropdownWrapper";
import { ClearIcon, CloseIcon, TriangleExpandIcon } from "@/app/_assets/icons";

export interface FilterOption {
  text: string;
  onClick: () => void;
}

export type FilterType = "dropdown" | "toggle";

export interface FilterConfig {
  type: FilterType;
  label: string;
  value?: string | boolean | null;
  isVisible?: boolean;
  setIsVisible?: any;
  options?: any;
  onClear?: () => void;
  onToggle?: () => void;
  excludes?: string[];
}

interface GenericFiltersProps {
  filters: FilterConfig[];
}

const GenericFilters: React.FC<GenericFiltersProps> = ({ filters }) => {
  // Check if any filter is active.
  const hasActiveFilters = filters.some((filter) => {
    if (typeof filter.value === "boolean") {
      return filter.value;
    }
    return filter.value !== null && filter.value !== undefined;
  });

  // When "Clear All" is clicked, call each filter's onClear callback if provided.
  const clearAllFilters = () => {
    filters.forEach((filter) => {
      if (filter.onClear) {
        filter.onClear();
      }
    });
  };

  return (
    <div className="flex items-center gap-2 h-8">
      {/* Show the "Clear All" button only if at least one filter is active */}
      {hasActiveFilters && (
        <div
          onClick={clearAllFilters}
          className="bg-battleground rounded-full h-full aspect-square text-inactive grid place-items-center hover:bg-hover hover:text-primary cursor-pointer"
        >
          <CloseIcon className="h-2.5" />
        </div>
      )}
      {filters.map((filter, idx) => {
        if (filter.type === "dropdown") {
          return (
            <div key={idx} className="flex gap-[1px] h-full">
              {filter.value ? (
                <>
                  <DropdownWrapper
                    isActive={filter.isVisible!}
                    setIsActive={filter.setIsVisible!}
                    options={filter.options!}
                  >
                    <div className="filter-1 filter-1-selected pr-2 !rounded-r-none">
                      <span className="font-semibold text-[13px] flex items-center">
                        {filter.value}
                      </span>
                      <TriangleExpandIcon
                        className={`w-1.5 transition-rotate duration-150 ease-in-out ${
                          filter.isVisible ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </DropdownWrapper>
                  <div
                    onClick={filter.onClear}
                    className="filter-1-selected-clear"
                  >
                    <ClearIcon className="h-2" />
                  </div>
                </>
              ) : (
                <DropdownWrapper
                  isActive={filter.isVisible!}
                  setIsActive={filter.setIsVisible!}
                  options={filter.options!}
                >
                  <div className="filter-1 filter-1-inactive">
                    <span className="font-semibold text-[13px]">
                      {filter.label}
                    </span>
                    <TriangleExpandIcon
                      className={`w-1.5 transition-rotate duration-150 ease-in-out ${
                        filter.isVisible ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </DropdownWrapper>
              )}
            </div>
          );
        } else if (filter.type === "toggle") {
          // For toggle filters, wrap the onClick handler to support exclusions.
          const handleToggle = () => {
            // If turning the filter on (i.e. it's currently inactive)
            if (!filter.value) {
              if (filter.excludes && filter.excludes.length > 0) {
                filters.forEach((otherFilter) => {
                  // If the other filter is listed in this filter's "excludes" list...
                  if (
                    otherFilter.label !== filter.label &&
                    filter.excludes?.includes(otherFilter.label)
                  ) {
                    // ...and it is active, clear it.
                    if (otherFilter.onClear && otherFilter.value) {
                      otherFilter.onClear();
                    }
                  }
                });
              }
            }
            // Finally, toggle this filter.
            if (filter.onToggle) {
              filter.onToggle();
            }
          };

          return (
            <div
              onClick={handleToggle}
              key={idx}
              className={`filter-1 ${
                filter.value
                  ? "bg-brand/10 hover:bg-brand/20 text-brand"
                  : "bg-battleground text-inactive hover:text-primary"
              }`}
            >
              <span className="font-semibold text-[13px]">{filter.label}</span>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default GenericFilters;
