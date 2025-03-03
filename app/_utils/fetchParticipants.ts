import _ from "lodash";
import { getPeople, getUsersByEmail } from "../_services/client";

export const fetchParticipants = async (
  editors: any,
  viewers: any,
  author: any,
  guests: any
) => {
  try {
    const [editorsDocs, viewersDocs, authorDoc]: any = await Promise.all([
      getPeople(editors, []),
      getPeople(viewers, []),
      getPeople([author], []),
    ]);
    const editorsWithRoles = editorsDocs.map((doc: any) => ({
      ...doc,
      role: "editor",
    }));

    const viewersWithRoles = viewersDocs.map((doc: any) => ({
      ...doc,
      role: "viewer",
    }));

    const authorWithRole = [{ ...authorDoc[0], role: "author" }];

    const guestsWithRoles = guests.map((guest: any) => ({
      alias: guest,
      role: "guest",
    }));

    return _.uniqWith(
      [
        ...editorsWithRoles,
        ...viewersWithRoles,
        ...authorWithRole,
        ...guestsWithRoles,
      ],
      (a, b) => {
        if (a.id && b.id) {
          // Both have an id: consider duplicates if equal.
          if (a.id === b.id) return true;
        } else if (a.alias && b.alias) {
          // Both have an alias: consider duplicates if equal.
          if (a.alias === b.alias) return true;
        }
        // Otherwise, treat them as distinct.
        return false;
      }
    );
  } catch (error) {
    console.error("Error fetching participants:", error);
  }
};
