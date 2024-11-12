import { NextResponse } from "next/server";
import { pusherServer } from "@/app/_config/pusher";

export async function POST(req: Request) {
  try {
    let socket_id: string;
    let channel_name: string;
    let body: any;

    const contentType = req.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      body = await req.json();
      socket_id = body.socket_id;
      channel_name = body.channel_name;
    } else {
      // Handle URL-encoded form data
      const formData = await req.formData();
      socket_id = formData.get("socket_id") as string;
      channel_name = formData.get("channel_name") as string;
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

    if (!channel_name) {
      return NextResponse.json(
        { error: "Channel name is required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const auth = pusherServer.authorizeChannel(socket_id, channel_name, {
      user_id: userId,
      user_info: { name: "John Doe" },
    });

    return NextResponse.json(auth);
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
