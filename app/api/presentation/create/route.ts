// import processScript from "@/app/_lib/processScript";
import { serverTimestamp } from "firebase/database";
import formatScript from "@/app/_lib/formatScript";
import { NextResponse } from "next/server";
import {
  generateUniquePresentationCode,
  createPresentation,
  addPresentationParticipants,
} from "@/app/_services/server";

export async function POST(request: Request) {
  try {
    const { script, nodes, userId, scriptParticipants } = await request.json();

    // Format the script for the presentation
    const { formattedScript } = formatScript(nodes);

    // Prepare participants data
    // const participants = scriptParticipants.map((scriptsParticipant: any) => ({
    //   ...scriptsParticipant,
    //   isConnected: false,
    // }));

    // Generate a unique presentation code
    const generatedCode: string = await generateUniquePresentationCode();

    // Build the presentation data
    const presentation = {
      createdAt: serverTimestamp(),
      title: script.title,
      createdBy: userId,
      hosts: [userId],
      nodes: formattedScript,
      scriptId: script.id,
      participants: scriptParticipants,
      code: generatedCode,
      status: "active",
      lastParticipantDisconnectedAt: null,
      lastMessage: {
        position: 0,
        senderId: null,
      },
    };

    const presentationId: any = await createPresentation(presentation);

    await addPresentationParticipants(
      presentationId,
      Object.keys(scriptParticipants)
    );

    // Return the generated code for the presentation
    return new Response(generatedCode);
  } catch (error) {
    console.error("Error creating presentation:", error);
    return NextResponse.json(
      { error: "Failed to create presentation" },
      { status: 500 }
    );
  }
}
