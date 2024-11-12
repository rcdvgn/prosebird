import { NextResponse } from "next/server";
import { pusherServer } from "@/app/_config/pusher";

export async function POST(request: Request) {
  try {
    const { presentationCode, currentPosition, targetPosition, userId } =
      await request.json();

    if (targetPosition !== currentPosition) {
      await pusherServer.trigger(
        `presence-${presentationCode}`,
        "update-position",
        {
          position: targetPosition,
          senderId: userId,
        }
      );
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error updating the presentation progress:", error);
    return NextResponse.json(
      { error: "Error updating the presentation progress." },
      { status: 500 }
    );
  }
}
