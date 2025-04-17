import { NextResponse } from "next/server";
import isEmail from "validator/lib/isEmail";
import { admin } from "@/app/_config/firebase/admin";

const db = admin.firestore();

async function verifyRecaptcha(token: string) {
  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY || "",
          response: token,
        }).toString(),
      }
    );

    const data = await response.json();

    // Verify the response
    if (data.success && data.score >= 0.5) {
      return true;
    } else {
      console.log("reCAPTCHA verification failed:", data);
      return false;
    }
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { email, recaptchaToken, source, details } = await request.json();

    if (!isEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA token
    if (!recaptchaToken) {
      return NextResponse.json(
        { error: "reCAPTCHA verification required." },
        { status: 403 }
      );
    }

    const isValidToken = await verifyRecaptcha(recaptchaToken);
    if (!isValidToken) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed." },
        { status: 403 }
      );
    }

    const applicationsRef = db.collection("applications");
    const emailQuery = await applicationsRef.where("email", "==", email).get();
    const isNewEmail = emailQuery.empty;

    if (isNewEmail) {
      const docRef = await applicationsRef.add({ email, source, details });
      return NextResponse.json(
        {
          id: docRef.id,
          isNewEmail: true,
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json({
        isNewEmail: false,
        message: "Email already applied to early access",
      });
    }
  } catch (error) {
    console.error("Error processing early access application:", error);
    return NextResponse.json(
      { error: "Failed to process early access application" },
      { status: 500 }
    );
  }
}
