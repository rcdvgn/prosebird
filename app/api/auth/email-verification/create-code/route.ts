// app/api/verify-email/route.ts
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import axios from "axios";
import { saveVerificationCode, userExists } from "@/app/_services/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const exists = await userExists(email);
    if (exists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 404 }
      );
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = Date.now() + 30 * 60 * 1000;

    const verifyToken = uuidv4(); // e.g. "ab1d-e9f3-94a8..."

    await saveVerificationCode(email, code, expiresAt, verifyToken);

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "noreply", email: "no-reply@prosebird.com" },
        to: [{ email }],
        templateId: 3,
        params: {
          code,
          year: new Date().getFullYear(),
        },
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY!,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Verification error:", error.message);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
