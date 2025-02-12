import React from "react";
import DropdownWrapper from "../wrappers/DropdownWrapper";
import { ClearIcon, TriangleExpandIcon } from "@/app/_assets/icons";

export default function DefaultFilters({
  roleFilter,
  isRoleFilterOptionsVisible,
  setIsRoleFilterOptionsVisible,
  roleFilterOptions,
  setRoleFilter,
  setFavoriteFilter,
  favoriteFilter,
  setSharedFilter,
  sharedFilter,
}: any) {
  return (
    <div className="flex items-center gap-2">
      {roleFilter ? (
        <div className="flex gap-[1px] h-8">
          <DropdownWrapper
            isVisible={isRoleFilterOptionsVisible}
            setIsVisible={setIsRoleFilterOptionsVisible}
            options={roleFilterOptions}
          >
            <div className="filter-1 filter-1-selected !rounded-r-none">
              <span className="font-semibold text-[13px] flex items-center">
                {roleFilter}
              </span>
              <TriangleExpandIcon
                className={`w-1.5 transition-rotate duration-150 ease-in-out ${
                  isRoleFilterOptionsVisible ? "rotate-180" : ""
                }`}
              />
            </div>
          </DropdownWrapper>

          <div
            onClick={() => setRoleFilter(null)}
            className="filter-1-selected-clear"
          >
            <ClearIcon className="h-2" />
          </div>
        </div>
      ) : (
        <DropdownWrapper
          isVisible={isRoleFilterOptionsVisible}
          setIsVisible={setIsRoleFilterOptionsVisible}
          options={roleFilterOptions}
        >
          <div className="filter-1 filter-1-inactive">
            <span className="font-semibold text-[13px]">Role</span>
            <TriangleExpandIcon
              className={`w-1.5 transition-rotate duration-150 ease-in-out ${
                isRoleFilterOptionsVisible ? "rotate-180" : ""
              }`}
            />
          </div>
        </DropdownWrapper>
      )}

      <div
        onClick={() =>
          setFavoriteFilter((currFavoriteFilter: any) => !currFavoriteFilter)
        }
        className={`filter-1 ${
          favoriteFilter
            ? "bg-brand/10 hover:bg-brand/15 text-brand"
            : "bg-battleground text-inactive hover:text-primary"
        }`}
      >
        <span className="font-semibold text-[13px]">Favorite</span>
      </div>

      <div
        onClick={() =>
          setSharedFilter((currSharedFilter: any) => !currSharedFilter)
        }
        className={`filter-1 ${
          sharedFilter
            ? "bg-brand/10 hover:bg-brand/15 text-brand"
            : "bg-battleground text-inactive hover:text-primary"
        }`}
      >
        <span className="font-semibold text-[13px]">Shared</span>
      </div>
    </div>
  );
}
