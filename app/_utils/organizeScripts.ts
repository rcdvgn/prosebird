import matchToRole from "../_utils/matchToRole";
import { isScriptShared } from "../_utils/isScriptShared";

export interface FilterOptions {
  roleFilter?: string | null;
  favoriteFilter?: boolean;
  sharedFilter?: boolean;
}

export interface SortingOptions {
  sortedBy: "lastModified" | "title";
  order: "asc" | "desc";
}

/** Filters the scripts based on role, favorite and shared options */
export const filterScripts = (
  scripts: any[],
  { roleFilter, favoriteFilter, sharedFilter }: FilterOptions,
  user: any
) => {
  if (!scripts) return [];
  return scripts.filter((script: any) => {
    const filterByRole = roleFilter
      ? matchToRole(script, roleFilter, user)
      : true;
    const filterByFavorite = favoriteFilter ? script.isFavorite : true;
    const filterByShared = sharedFilter ? isScriptShared(script) : true;
    return filterByRole && filterByFavorite && filterByShared;
  });
};

/** Sorts the scripts based on the sorting options */
export const sortScripts = (scripts: any[], sorting: SortingOptions) => {
  if (!scripts) return [];
  let sortedScripts: any[];
  if (sorting.sortedBy === "lastModified") {
    sortedScripts = [...scripts];
  } else if (sorting.sortedBy === "title") {
    sortedScripts = scripts.sort((a: any, b: any) =>
      a.title
        .toLowerCase()
        .localeCompare(b.title.toLowerCase(), undefined, { numeric: true })
    );
  } else {
    sortedScripts = scripts;
  }
  return sorting.order === "asc" ? sortedScripts.reverse() : sortedScripts;
};
