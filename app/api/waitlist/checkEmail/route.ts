import { NextResponse } from "next/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/app/_config/fireabase";
import EmailValidator from "email-validator";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Check if email is valid
    if (!EmailValidator.validate(email)) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }

    const waitlistRef = collection(db, "waitlist");
    const emailQuery = query(waitlistRef, where("email", "==", email));
    const querySnapshot = await getDocs(emailQuery);

    // Return whether the email is new (not already on the waitlist)
    return NextResponse.json({ isNewEmail: querySnapshot.empty });
  } catch (error) {
    console.error("Error checking waitlist email:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
