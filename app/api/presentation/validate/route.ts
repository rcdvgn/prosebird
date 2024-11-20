// /app/api/presentation/validate.ts
import { NextResponse } from "next/server";
import { getPresentationByCode } from "@/app/_actions/actions";

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
      return NextResponse.json({ presentation: null }, { status: 200 });
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
