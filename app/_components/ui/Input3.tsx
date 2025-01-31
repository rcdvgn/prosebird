import { SearchIcon } from "@/app/_assets/icons";
import React from "react";

export default function Input3() {
  return (
    <div className="flex items-center grow h-11 rounded-[10px] pr-2.5">
      <span className="p-1">
        <SearchIcon className="text-secondary h-3.5" />
      </span>

      <input
        type="text"
        className="grow outline-none border-none h-full bg-transparent text-primary font-medium text-sm px-2 placeholder:text-placeholder"
        placeholder="Search"
      />
    </div>
  );
}
