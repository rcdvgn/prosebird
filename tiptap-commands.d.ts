// tiptap-commands.d.ts
import { Commands } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    insertChapter: {
      (): ReturnType;
    };
  }
}

export {}; // This ensures the file is treated as a module.
