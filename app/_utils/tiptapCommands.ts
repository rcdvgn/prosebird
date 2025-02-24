export const toggleComment = (editor: any) => {
  if (!editor) return;

  const { state, commands } = editor;
  const { from, to } = state.selection;

  if (from !== to) {
    const selectedText = state.doc.textBetween(from, to);
    editor
      .chain()
      .deleteRange({ from, to })
      .insertContentAt(from, `[${selectedText}]`)
      .setTextSelection(from + selectedText.length + 2)
      .run();
  } else {
    editor
      .chain()
      .insertContent("[]")
      .setTextSelection(from + 1)
      .run();
  }
};

// Define your stored chapter type for clarity
interface ChapterData {
  title: string;
  id: string;
  speaker?: string;
  paragraphs: string[];
}

/**
 * Converts an array of chapters into a TipTap/ProseMirror-compatible document.
 */
export function rehydrateEditorContent(chapters: ChapterData[]) {
  const nodes = chapters.flatMap((chapter, index) => {
    const content = [];

    // Add title node if exists
    if (chapter.title) {
      content.push({
        type: "title",
        content: [{ type: "text", text: chapter.title }],
      });
    }

    // Process each paragraph
    chapter.paragraphs.forEach((paragraph) => {
      // Use a zero-width space if paragraph is empty.
      const text = paragraph.trim() === "" ? "\u200B" : paragraph;
      content.push({
        type: "paragraph",
        content: [{ type: "text", text }],
      });
    });

    return [
      {
        type: "chapter",
        // Pass along extra attributes
        attrs: { id: chapter.id, speaker: chapter.speaker, position: index },
        content,
      },
    ];
  });

  return {
    type: "doc",
    content: nodes,
  };
}
