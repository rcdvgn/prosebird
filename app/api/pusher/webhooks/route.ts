import { NextResponse } from "next/server";
import {
  changeMemberStatus,
  getPresentationByCode,
} from "@/app/_actions/actions";

export async function POST(req: Request) {
  const body = await req.json();
  const { events } = body;
  const errors: string[] = [];

  await Promise.all(
    events.map(async (event: any) => {
      const { name: eventName, channel, user_id: userId } = event;

      const presentationCode = channel
        ? channel.replace("presence-", "")
        : null;

      const presentation: any = await getPresentationByCode(presentationCode);

      if (!presentation) {
        errors.push(`No presentation found for code: ${presentationCode}`);
        return;
      }

      const participants = presentation?.participants || [];

      try {
        if (eventName === "member_removed") {
          await changeMemberStatus(
            presentation?.id,
            participants,
            userId,
            false
          );
        } else if (eventName === "member_added") {
          await changeMemberStatus(
            presentation?.id,
            participants,
            userId,
            true
          );
        }
      } catch (error) {
        errors.push(
          `Error processing event: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    })
  );

  // If there were any errors, you can log them or return them
  if (errors.length > 0) {
    console.error("Webhook processing errors:", errors);
    return NextResponse.json(
      {
        success: false,
        errors,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ status: 200 });
}
