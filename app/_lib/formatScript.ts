export default function formatScript(nodes: any) {
  let counter = -1;

  const formattedScript = nodes.map((node: any) => {
    const words = node.paragraph
      .split(" ")
      .reduce((acc: { [key: number]: string }, word: string) => {
        counter++;
        acc[counter] = word;
        return acc;
      }, {});

    return { ...node, paragraph: words };
  });

  console.log("formattedScript: " + formattedScript);

  return formattedScript;
}
