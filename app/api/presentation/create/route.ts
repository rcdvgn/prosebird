import { rtdb } from "@/app/_config/fireabase";
import processScript from "@/app/_lib/processScript";
import { ref, push, serverTimestamp, set } from "firebase/database";
import formatScript from "@/app/_lib/formatScript";
import { NextResponse } from "next/server";
import { generateUniquePresentationCode } from "@/app/_actions/actions";

export async function POST(request: Request) {
  try {
    const { script, userId, scriptParticipants } = await request.json();

    // Format the script for the presentation
    const { formattedScript } = formatScript(script.data.nodes, userId);

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
      host: userId,
      nodes: formattedScript,
      scriptId: script.id,
      participants: scriptParticipants,
      code: generatedCode,
      lastMessage: {
        position: 0,
        senderId: null,
      },
    };

    // Reference to the 'presentations' node in RTDB
    const presentationsRef = ref(rtdb, "presentations");

    // Push the presentation data to RTDB
    const newPresentationRef = push(presentationsRef);
    await set(newPresentationRef, presentation);

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
