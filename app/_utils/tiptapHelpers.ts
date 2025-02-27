export function extractChaptersFromDoc(doc: any) {
  if (!doc || !doc.content) return [];

  return doc.content
    .filter((node: any) => node.type === "chapter")
    .map((chapter: any, index: any) => {
      const titleNode = chapter.content.find(
        (child: any) => child.type === "title"
      );

      const titleText = titleNode.content
        ? titleNode.content?.map((c: any) => c.text).join("")
        : "";

      const paragraphs = chapter.content
        .filter((child: any) => child.type === "paragraph")
        .map((para: any) =>
          para.content
            ? para.content.map((c: any) => {
                return { text: c.text, marks: c.marks ?? [] };
              })
            : [{ text: "" }]
        );

      return {
        id: chapter.attrs?.id,
        speaker: chapter.attrs?.speaker,
        title: titleText,
        paragraphs,
      };
    });
}

export const isCursorInComment = (editor: any) => {
  if (!editor) return false;

  const { state } = editor;
  const { from } = state.selection;
  const $pos = state.doc.resolve(from);

  // First get the marks at cursor position
  let marks = $pos.marks();

  // If we have marks at the cursor position, we need to check if we're at the edge of a comment
  if (marks.some((mark: any) => mark.type.name === "comment")) {
    // Get the content around this position to check if we're right after a closing bracket
    const textBefore = state.doc.textBetween(Math.max(0, from - 10), from);

    // If the text immediately before the cursor ends with a closing bracket,
    // we're actually outside the comment despite what the marks say
    if (textBefore.endsWith("]")) {
      return false;
    }

    return true;
  }

  // If no marks at current position but we're not at the start of the document
  if (marks.length === 0 && $pos.parentOffset > 0) {
    // Check position right before cursor
    const before = from - 1;
    const $before = state.doc.resolve(before);

    if ($before.parent === $pos.parent) {
      // Get the content to check if we're after a comment closing
      const textBefore = state.doc.textBetween(Math.max(0, from - 10), from);

      // If there's a closing bracket right before us, don't consider this a comment
      if (textBefore.endsWith("]")) {
        return false;
      }

      // Otherwise check for comment mark
      const hasCommentMark = state.doc.rangeHasMark(
        before,
        before + 1,
        editor.schema.marks.comment
      );

      return hasCommentMark;
    }
  }

  return false;
};

export const getTextAlignment = (editor: any) => {
  if (!editor) return "left";

  // Default to left
  let commonAlignment = "left";
  let foundParagraph = false;

  // Check all paragraphs in the document to find the common alignment
  editor.state.doc.descendants((node: any) => {
    if (node.type.name === "paragraph") {
      const alignment = node.attrs.textAlign || "left";

      if (!foundParagraph) {
        // First paragraph found, set the initial alignment
        commonAlignment = alignment;
        foundParagraph = true;
      } else if (commonAlignment !== alignment) {
        // If different alignments are found, return mixed
        commonAlignment = "mixed";
        return false; // Stop traversal
      }
    }
    return true;
  });

  return commonAlignment;
};
