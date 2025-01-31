import { SearchIcon } from "@/app/_assets/icons";
import AllDocuments from "@/app/_components/AllDocuments";

export default function Files() {
  return (
    <div className="flex flex-col w-full">
      <div className="ring-red-500 ring-1 px-10 h-[68px] w-full shrink-0 flex items-center justify-between">
        <div className="flex items-center w-[350px] h-11 bg-battleground rounded-[10px] px-2.5">
          <span className="p-1">
            <SearchIcon className="text-secondary h-3.5" />
          </span>

          <input type="text" className="!grow input-2" placeholder="Search" />

          <span className="bg-middleground rounded-md font-bold text-secondary text-[11px] py-1 px-2">
            ctrl+k
          </span>
        </div>
      </div>
      <div className="slate">
        <AllDocuments />
      </div>
    </div>
  );
}
