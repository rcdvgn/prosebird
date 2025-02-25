export function extractChaptersFromDoc(doc: any) {
  if (!doc || !doc.content) return [];

  return doc.content
    .filter((node: any) => node.type === "chapter")
    .map((chapter: any) => {
      const titleNode = chapter.content.find(
        (child: any) => child.type === "title"
      );
      const titleText = titleNode
        ? titleNode.content?.map((c: any) => c.text).join("")
        : "";

      console.log(chapter.content);
      const paragraphs = chapter.content
        .filter((child: any) => child.type === "paragraph")
        .map((para: any) =>
          para.content ? para.content.map((c: any) => c.text).join("") : ""
        );

      return {
        id: chapter.attrs?.id,
        speaker: chapter.attrs?.speaker,
        title: titleText,
        paragraphs,
      };
    });
}
