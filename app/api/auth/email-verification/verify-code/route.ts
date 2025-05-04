// app/api/verify-code/route.ts

import { getEmailVerification } from "@/app/_services/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, code } = await request.json();

  if (!email || !code) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!email || !code || !/^[0-9]{4}$/.test(code)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const verification = await getEmailVerification(email);

    if (!verification) {
      return NextResponse.json(
        { error: "Verification not found" },
        { status: 404 }
      );
    }

    const { code: storedCode, expiresAt, verifyToken } = verification;

    if (Date.now() > expiresAt) {
      return NextResponse.json({ error: "Code expired" }, { status: 410 });
    }

    if (storedCode !== code) {
      return NextResponse.json({ error: "Invalid code" }, { status: 401 });
    }

    // Optionally: update status to "verified" here if you're using that system
    // await markEmailAsVerified(email);

    return NextResponse.json({
      success: true,
      redirectUrl: `/create-password/${verifyToken}`,
    });
  } catch (err: any) {
    console.error("Verification error:", err.message);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
