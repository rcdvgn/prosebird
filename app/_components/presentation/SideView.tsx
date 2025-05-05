"use client";

import { CloseIcon, SearchIcon } from "@/app/_assets/icons";
import Search from "./sideview/Search";

export default function SideView({ tab, setTab }: any) {
  if (!tab) return null;

  const tabs: any = {
    search: {
      title: "Search",
      icon: <SearchIcon filled={true} className="h-4" />,
      component: <Search />,
    },
  };

  return (
    <div className="w-[360px] h-full slate ml-2 flex flex-col">
      <div className="shrink-0 h-[60px] w-full flex justify-between items-center px-5 border-b-[1px] border-stroke">
        <div className="flex items-center gap-2.5 text-primary">
          <span className="">{tabs[tab].icon}</span>

          <span className="text-base font-bold">{tabs[tab].title}</span>
        </div>

        <span
          onClick={() => setTab(null)}
          className="text-tertiary hover:text-primary cursor-pointer"
        >
          <CloseIcon className="h-3.5" />
        </span>
      </div>

      <div className="w-full grow py-2.5 min-h-0">{tabs[tab].component}</div>
    </div>
  );
}
