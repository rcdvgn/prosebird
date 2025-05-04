// app/api/create-account/route.ts

import {
  createFirebaseUser,
  getEmailVerificationByToken,
  userExists,
} from "@/app/_services/server";
import { NextResponse } from "next/server";
import { passwordStrength } from "check-password-strength";

export async function POST(request: Request) {
  try {
    const { password, token } = await request.json();

    if (!password || !token) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (passwordStrength(password).id < 1) {
      return NextResponse.json({ error: "Password too weak" }, { status: 422 });
    }

    const verification = await getEmailVerificationByToken(token);

    if (!verification) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 404 }
      );
    }

    const { email, ref } = verification;

    const exists = await userExists(email);
    if (exists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    await createFirebaseUser(email, password);

    // Cleanup: remove the verification entry
    await ref.delete();

    return NextResponse.json({ success: true, email });

  } catch (error: any) {
    console.error("Account creation error:", error.message);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
