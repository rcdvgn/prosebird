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
      getUsersByEmail(editors, []),
      getUsersByEmail(viewers, []),
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

    return [
      ...editorsWithRoles,
      ...viewersWithRoles,
      ...authorWithRole,
      ...guestsWithRoles,
    ];
  } catch (error) {
    console.error("Error fetching participants:", error);
  }
};
