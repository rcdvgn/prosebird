import { NextResponse } from "next/server";
import { updatePresentation } from "@/app/_services/server";

export async function POST(request: Request) {
  try {
    const { presentationId, currentPosition, userId } = await request.json();

    await updatePresentation(presentationId, currentPosition, userId);

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error updating the presentation progress:", error);
    return NextResponse.json(
      { error: "Error updating the presentation progress." },
      { status: 500 }
    );
  }
}
