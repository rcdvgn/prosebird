// /app/api/presentation/validate.ts
import { NextResponse } from "next/server";
import { db } from "@/app/_config/fireabase"; // Firebase config file
import { doc, getDoc } from "firebase/firestore";

import { decode } from "@/app/_utils/idEncoder";

export async function POST(request: Request) {
  try {
    const { presentationCode } = await request.json();

    if (!presentationCode) {
      return NextResponse.json(
        { error: "Presentation code is required." },
        { status: 400 }
      );
    }

    const docId: any = decode(presentationCode);
    console.log("Decoded ID:", docId);

    const docRef = doc(db, "presentations", presentationCode);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ presentation: null }, { status: 200 });
    }

    // console.log(docSnap.data());

    return NextResponse.json({ presentation: docSnap.data() }, { status: 200 });
  } catch (error) {
    console.error("Error validating presentation code:", error);
    return NextResponse.json(
      { error: "Error validating presentation code." },
      { status: 500 }
    );
  }
}
