import { Mark } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

export interface CommentOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    comment: {
      toggleComment: () => ReturnType;
    };
  }
}

export const Comment = Mark.create<CommentOptions>({
  name: "comment",
  inclusive: false,
  addOptions() {
    return {
      HTMLAttributes: {
        class: "tiptap-comment",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span.tiptap-comment",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", { ...this.options.HTMLAttributes, ...HTMLAttributes }, 0];
  },

  addCommands() {
    return {
      toggleComment:
        () =>
        ({ commands, chain, state, tr }) => {
          const { from, to } = state.selection;

          if (from === to) {
            // Case 2: No selected text - handle spacing like in original code
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
            let cursorOffset = 1;

            if (needsSpaceBefore) {
              contentToInsert = " []";
              cursorOffset = 2;
            }

            if (needsSpaceAfter) {
              contentToInsert = contentToInsert + " ";
            }

            return chain()
              .insertContent(contentToInsert)
              .setTextSelection(from + cursorOffset)
              .focus()
              .run();
          } else {
            // Case 1: There is selected text
            const selectedText = state.doc.textBetween(from, to);

            return chain()
              .deleteRange({ from, to })
              .insertContentAt(from, `[${selectedText}]`)
              .setTextSelection(from + selectedText.length + 1)
              .focus()
              .run();
          }
        },
    };
  },

  // This is the key part - we'll detect comments dynamically based on text content
  addProseMirrorPlugins() {
    const pluginKey = new PluginKey("comment-validator");

    return [
      new Plugin({
        key: pluginKey,
        appendTransaction: (transactions, oldState, newState) => {
          // Skip if no changes
          if (!transactions.some((tr) => tr.docChanged)) return null;

          const tr = newState.tr;
          let modified = false;

          // Process the document to find and mark comments
          newState.doc.descendants((node, pos) => {
            if (!node.isText) return true;

            const text = node.text || "";

            // Find potential comment patterns using regex
            const commentRegex = /\[([^\[\]\s][^\[\]]*[^\[\]\s]|[^\[\]\s])\]/g;

            let match;

            while ((match = commentRegex.exec(text)) !== null) {
              const start = pos + match.index;
              const end = start + match[0].length;

              // Check if this potential comment has proper spacing around it
              const isValidComment = validateCommentSpacing(
                newState.doc,
                start,
                end
              );

              if (isValidComment) {
                // If it's a valid comment pattern, ensure it has the comment mark
                const hasCommentMark = newState.doc.rangeHasMark(
                  start,
                  end,
                  this.type
                );

                if (!hasCommentMark) {
                  tr.addMark(start, end, this.type.create());
                  modified = true;
                }
              }
            }

            // Also check for marks that no longer match the pattern
            const commentMark = node.marks.find(
              (mark) => mark.type.name === this.name
            );
            if (commentMark) {
              let hasValidPattern = false;
              commentRegex.lastIndex = 0; // Reset regex

              while ((match = commentRegex.exec(text)) !== null) {
                const start = pos + match.index;
                const end = start + match[0].length;

                if (start <= pos && end >= pos + node.nodeSize - 1) {
                  // This node is fully or partially covered by a valid comment pattern
                  hasValidPattern = true;
                  break;
                }
              }

              if (!hasValidPattern) {
                tr.removeMark(pos, pos + node.nodeSize, this.type);
                modified = true;
              }
            }

            return true;
          });

          return modified ? tr : null;
        },
      }),
    ];
  },
});

function validateCommentSpacing(doc: any, start: any, end: any) {
  // Check character before (if not at document start)
  let hasSpaceBefore = true; // Default to true for start of document
  if (start > 0) {
    const $before = doc.resolve(start);
    const nodeBefore = $before.nodeBefore;

    if (nodeBefore && nodeBefore.isText) {
      const lastChar = nodeBefore.text?.charAt(nodeBefore.text.length - 1);
      hasSpaceBefore =
        lastChar === " " || lastChar === "\n" || lastChar === "\t";
    } else {
      // If there's no text node before, it's probably the start of a node which is fine
      hasSpaceBefore = true;
    }
  }

  // Check character after (if not at document end)
  let hasSpaceAfter = true; // Default to true for end of document
  if (end < doc.content.size) {
    const $after = doc.resolve(end);
    const nodeAfter = $after.nodeAfter;

    if (nodeAfter && nodeAfter.isText) {
      const firstChar = nodeAfter.text?.charAt(0);
      hasSpaceAfter =
        firstChar === " " || firstChar === "\n" || firstChar === "\t";
    } else {
      // If there's no text node after, it's probably the end of a node which is fine
      hasSpaceAfter = true;
    }
  }

  return hasSpaceBefore && hasSpaceAfter;
}
