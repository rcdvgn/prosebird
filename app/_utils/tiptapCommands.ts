export const toggleComment = (editor: any) => {
  if (!editor) return;

  const { state } = editor;
  const { from, to } = state.selection;

  if (from !== to) {
    // Case 1: There is selected text
    const selectedText = state.doc.textBetween(from, to);

    // Get the surrounding context
    const parentNode = state.doc.resolve(from).parent;
    const textContent = parentNode.textContent;
    const positionInParentStart = from - state.doc.resolve(from).start();
    const positionInParentEnd = to - state.doc.resolve(from).start();

    // Check if we need a space before
    const needsSpaceBefore =
      positionInParentStart > 0 &&
      textContent.charAt(positionInParentStart - 1) !== " " &&
      textContent.charAt(positionInParentStart - 1) !== "";

    // Check if we need a space after
    const needsSpaceAfter =
      positionInParentEnd < textContent.length &&
      textContent.charAt(positionInParentEnd) !== " " &&
      textContent.charAt(positionInParentEnd) !== "";

    // Prepare content with appropriate spacing
    let contentToInsert = `[${selectedText}]`;
    let selectionOffset = selectedText.length + 2; // Position cursor after closing bracket

    if (needsSpaceBefore) {
      contentToInsert = ` ${contentToInsert}`;
      selectionOffset += 1;
    }

    if (needsSpaceAfter) {
      contentToInsert = `${contentToInsert} `;
    }

    editor
      .chain()
      .deleteRange({ from, to })
      .insertContentAt(from, contentToInsert)
      // Position the cursor right after the closing bracket
      .setTextSelection(from + selectionOffset)
      .focus()
      .run();
  } else {
    // Case 2: No selected text - we need to handle spacing

    // Get the current node's text content
    const currentNode = state.doc.nodeAt(from);
    const parentNode = state.doc.resolve(from).parent;
    const textContent = parentNode.textContent;
    const positionInNode = from - state.doc.resolve(from).start();

    // Check if we need to add a space before the brackets
    const needsSpaceBefore =
      positionInNode > 0 &&
      textContent.charAt(positionInNode - 1) !== " " &&
      textContent.charAt(positionInNode - 1) !== "";

    // Check if we need to add a space after the brackets
    const needsSpaceAfter =
      positionInNode < textContent.length &&
      textContent.charAt(positionInNode) !== " " &&
      textContent.charAt(positionInNode) !== "";

    // Determine what to insert based on spacing needs
    let contentToInsert = "[]";
    let cursorOffset = 1; // Position cursor between brackets when no text is selected

    if (needsSpaceBefore) {
      contentToInsert = " []";
      cursorOffset = 2;
    }

    if (needsSpaceAfter) {
      contentToInsert = contentToInsert + " ";
    }

    editor
      .chain()
      .insertContent(contentToInsert)
      // Position the cursor between the brackets when no text is selected
      .setTextSelection(from + cursorOffset)
      .focus()
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
    const title = chapter.title.trim() === "" ? "\u200B" : chapter.title;

    content.push({
      type: "title",
      attrs: {
        id: chapter.id,
        speaker: chapter.speaker,
        position: index,
      },
      content: [{ type: "text", text: title }],
    });

    // Process each paragraph in the new format (array of text/marks objects)
    console.log(chapter.paragraphs.length);

    chapter.paragraphs.forEach((paragraph: any) => {
      const paragraphContent = paragraph.map((item: any) => {
        // Use a zero-width space if the text is empty or whitespace only
        const text = item.text.trim() === "" ? "\u200B" : item.text;
        const textNode: any = { type: "text", text };

        // Add marks if they exist
        if (item.marks && item.marks.length > 0) {
          textNode.marks = item.marks;
        }
        return textNode;
      });

      content.push({
        type: "paragraph",
        attrs: {
          position: index,
        },
        content: paragraphContent,
      });
    });

    return [
      {
        type: "chapter",
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

import { EditorState } from "prosemirror-state";

export function resetEditorContent(editor: any, newContent: any) {
  editor.commands.setContent(newContent);

  // Create a new editor state using the current document, plugins, and schema.
  const newEditorState = EditorState.create({
    doc: editor.state.doc,
    plugins: editor.state.plugins,
    schema: editor.state.schema,
  });
  // Update the editor view to clear the history.
  editor.view.updateState(newEditorState);
}
