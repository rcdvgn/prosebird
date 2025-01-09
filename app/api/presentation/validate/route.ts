// /app/api/presentation/validate.ts
import { NextResponse } from "next/server";
import {
  getPresentationByCode,
  updatePresentationStatus,
  getServerTimestampRTDB,
} from "@/app/_services/server";

export async function POST(request: Request) {
  try {
    const { presentationCode } = await request.json();

    if (!presentationCode) {
      return NextResponse.json(
        { error: "Presentation code is required." },
        { status: 400 }
      );
    }

    const presentation: any = await getPresentationByCode(presentationCode);

    if (!presentation) {
      return NextResponse.json(
        { error: "Presentation not found." },
        { status: 500 }
      );
    }

    if (presentation.status !== "active") {
      return NextResponse.json(
        { error: "Inactive presentation." },
        { status: 500 }
      );
    }

    const serverTimestamp: any = await getServerTimestampRTDB();

    if (
      serverTimestamp - presentation.lastParticipantDisconnectedAt >
      5 * 60 * 1000
    ) {
      // If no participants for 55+ minutes or `lastParticipantDisconnectedAt` is null
      await updatePresentationStatus(presentation.id, "inactive");

      return NextResponse.json(
        {
          error: "Presentation has been marked as inactive due to inactivity.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ presentation }, { status: 200 });
  } catch (error) {
    console.error("Error validating presentation code:", error);
    return NextResponse.json(
      { error: "Error validating presentation code." },
      { status: 500 }
    );
  }
}
