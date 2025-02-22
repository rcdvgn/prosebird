export function extractChaptersFromDoc(doc: any) {
  if (!doc || !doc.content) return [];

  return doc.content
    .filter((node: any) => node.type === "chapter")
    .map((chapter: any) => {
      // Extract the title text from the title node
      const titleNode = chapter.content.find(
        (child: any) => child.type === "title"
      );
      const titleText = titleNode
        ? titleNode.content?.map((c: any) => c.text).join("")
        : "";

      // Extract all paragraphs (for now, treating them as default paragraphs)
      const paragraphs = chapter.content
        .filter((child: any) => child.type === "paragraph")
        .map((para: any) => para.content?.map((c: any) => c.text).join(""));

      // Assume the speaker is stored as an attribute on the chapter node
      const speaker = chapter.attrs?.speaker || undefined;

      return { title: titleText, paragraphs, speaker };
    });
}
