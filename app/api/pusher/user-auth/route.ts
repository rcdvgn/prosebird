import { NextResponse } from "next/server";
import { pusherServer } from "@/app/_config/pusher";

export async function POST(req: Request) {
  try {
    let socket_id: string;
    let body: any;

    const contentType = req.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      body = await req.json();
      socket_id = body.socket_id;
    } else {
      // Handle URL-encoded form data
      const formData = await req.formData();
      socket_id = formData.get("socket_id") as string;
      body = Object.fromEntries(formData);
    }

    // Get user ID from headers or body
    const userId = req.headers.get("X-User-ID") || body.uid;

    if (!socket_id) {
      return NextResponse.json(
        { error: "Socket ID is required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Authenticate user
    const authResponse = pusherServer.authenticateUser(socket_id, {
      id: userId,
      user_info: {
        name: "John Doe", // You might want to get this from your actual user data
      },
    });

    console.log(authResponse);

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Pusher auth error:", error);
    return NextResponse.json(
      {
        error: "Authentication failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
