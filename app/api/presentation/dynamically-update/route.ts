import { NextResponse } from "next/server";
import matchToScript from "@/app/_lib/matchToScript";
import { updatePresentation } from "@/app/_services/server";

export async function POST(request: Request) {
  try {
    const { presentationId, currentPosition, words, userId, lastSpokenWords } =
      await request.json();

    const newPosition = matchToScript(currentPosition, words, lastSpokenWords);

    if (newPosition !== currentPosition) {
      await updatePresentation(presentationId, newPosition, userId);
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
