import { NextResponse } from "next/server";
import { pusherServer } from "@/app/_config/pusher";

export async function POST(request: Request) {
  try {
    const { presentationCode, currentPosition, userId } = await request.json();

    await pusherServer.trigger(
      `presence-${presentationCode}`,
      "update-position",
      {
        newPosition: currentPosition,
        senderId: userId,
      }
    );

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error updating the presentation progress:", error);
    return NextResponse.json(
      { error: "Error updating the presentation progress." },
      { status: 500 }
    );
  }
}
