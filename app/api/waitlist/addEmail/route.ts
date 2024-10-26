// app/api/waitlist/addEmail/route.ts
import { NextResponse } from "next/server";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/app/_config/fireabase";

export async function POST(request: Request) {
  const { email } = await request.json();

  try {
    const docRef = await addDoc(collection(db, "waitlist"), { email });
    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error("Error adding email to waitlist:", error);
    return NextResponse.json(
      { error: "Failed to add email to waitlist" },
      { status: 500 }
    );
  }
}
