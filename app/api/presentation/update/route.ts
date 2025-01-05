import { NextResponse } from "next/server";
import { ref, update } from "firebase/database";
import { rtdb } from "@/app/_config/fireabase";

export async function POST(request: Request) {
  try {
    const { presentationId, currentPosition, userId } = await request.json();

    const lastMessageRef = ref(
      rtdb,
      `presentations/${presentationId}/lastMessage`
    );

    // Update the data in the Realtime Database
    await update(lastMessageRef, {
      position: currentPosition,
      senderId: userId,
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error updating the presentation progress:", error);
    return NextResponse.json(
      { error: "Error updating the presentation progress." },
      { status: 500 }
    );
  }
}
