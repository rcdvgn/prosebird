"use client";

import { ChevronIcon, CloseIcon, SearchIcon } from "@/app/_assets/icons";
import { usePresentation } from "@/app/_contexts/PresentationContext";
import { searchPresentationScript } from "@/app/_utils/searchPresentationScript";
import React, { useEffect, useState } from "react";

export default function SideView() {
  return (
    <div className="w-[360px] h-full slate ml-2 flex flex-col">
      <div className="shrink-0 h-[60px] w-full flex justify-between items-center px-5 border-b-[1px] border-stroke">
        <div className="flex items-center gap-2.5 text-primary">
          <span className="">
            <SearchIcon filled={true} className="h-4" />
          </span>

          <span className="text-base font-bold">Search</span>
        </div>

        <span className="text-tertiary hover:text-primary cursor-pointer">
          <CloseIcon className="h-3.5" />
        </span>
      </div>

      <div className="w-full grow py-2.5 min-h-0">
        <Search />
      </div>
    </div>
  );
}

const Search = () => {
  const { wordsWithTimestamps, chaptersWithTimestamps } = usePresentation();

  const [qry, setQry] = useState<any>("");
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (!qry.length) return;

    const searchResults = searchPresentationScript(
      qry,
      wordsWithTimestamps,
      chaptersWithTimestamps
    );
    console.log(searchResults);

    setResults(searchResults);
  }, [qry]);

  return (
    <div className="flex flex-col gap-3 px-2.5 h-full w-full">
      <div className="w-full flex items-center overflow-hidden border-[1px] border-border bg-background rounded-xl h-11 shrink-0">
        <input
          value={qry}
          onChange={(e: any) => {
            setQry(e.target.value);
          }}
          placeholder="Search presentation"
          type="text"
          className="grow min-w-0 h-full border-none outline-none bg-transparent text-primary text-sm font-semibold placeholder:text-placeholder pl-3.5"
        />

        {qry && (
          <div className="px-2.5 h-full grid place-items-center">
            <span
              onClick={() => setQry("")}
              className="shrink-0 text-secondary h-5 w-5 rounded-full bg-selected grid place-items-center"
            >
              <CloseIcon className="h-2" />
            </span>
          </div>
        )}
      </div>

      <div className="w-full shrink-0">
        <span className="fomnt-semibold text-[13px] text-secondary">
          4 results in 2 chapters
        </span>
      </div>

      <div className="flex flex-col justify-start grow min-h-0 overflow-auto">
        {results &&
          results?.occurrences.map((result: any, index: any) => {
            return (
              <div key={index} className="flex flex-col">
                <SearchResult result={result} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

const SearchResult = ({ result }: any) => {
  const [isExpanded, setIsExpanded] = useState<any>(true);

  return (
    <>
      <div
        onClick={() => setIsExpanded((curr: any) => !curr)}
        className="group w-full px-2.5 flex gap-3 items-center justify-start h-10 cursor-pointer select-none"
      >
        <div className="h-5 w-5 grid place-items-center text-inactive group-hover:text-primary">
          <ChevronIcon
            className={`h-2.5 ${isExpanded ? "-rotate-90" : "rotate-90"}`}
          />
        </div>

        <div className="grow min-w-0 truncate font-bold text-sm text-primary">
          <span className="truncate">{result?.chapterTitle}</span>
        </div>

        <div className="ml-auto rounded-full min-w-5 h-5 grid place-items-center bg-brand px-1.5">
          <span className="font-bold text-xs text-primary">
            {result.occurrences.length}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="pl-2.5 flex">
          <div className="shrink-0 w-5 flex justify-center">
            <div className="h-full w-[1px] bg-border rounded-full"></div>
          </div>

          <div className="grow min-w-0">
            {result?.occurrences.map((occurrence: any, index: any) => {
              return (
                <div key={index} className="">
                  <div className="hover:bg-hover rounded-[10px] h-11 px-2.5 flex items-center leading-5 cursor-pointer text-secondary hover:text-primary">
                    <span className="truncate text-[13px] font-semibold">
                      <span className="">{occurrence?.beforeContext}</span>
                      <span className="bg-brand/15 rounded-[2px] !text-brand">
                        {occurrence?.match}
                      </span>
                      <span className="">{occurrence?.afterContext}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
