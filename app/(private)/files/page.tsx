import NewscriptTemplates from "@/app/_components/NewScriptTemplates";
import RecentlyModifiedScripts from "@/app/_components/RecentlyModifiedScripts";
import AllScripts from "@/app/_components/AllScripts";

export default function Files() {
  return (
    <div className="flex flex-col gap-12 px-8 py-6 grow min-w-0 overflow-auto">
      <NewscriptTemplates />
      <RecentlyModifiedScripts />
      <AllScripts />
    </div>
  );
}
