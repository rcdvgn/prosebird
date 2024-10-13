import NewscriptTemplates from "@/app/components/NewScriptTemplates";
import RecentlyModifiedScripts from "@/app/components/RecentlyModifiedScripts";
import AllScripts from "@/app/components/AllScripts";

export default function Files() {
  return (
    <div className="flex flex-col gap-12 px-8 py-6 grow min-w-0">
      <NewscriptTemplates />
      <RecentlyModifiedScripts />
      <AllScripts />
    </div>
  );
}
