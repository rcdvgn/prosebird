import { NextResponse } from "next/server";
import { pusherServer } from "@/app/_config/pusher";
import matchToScript from "@/app/_lib/matchToScript";
// import { db } from "@/app/_config/fireabase";
// import { doc, getDoc } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const { presentationCode, currentPosition, words, userId, transcript } =
      await request.json();

    // const docRef = doc(db, "presentations", presentationCode);
    // const docSnap = await getDoc(docRef);

    // if (!docSnap.exists() || docSnap.data().status !== "active") {
    //   return NextResponse.json(
    //     { error: "Invalid or inactive presentation code." },
    //     { status: 400 }
    //   );
    // }

    // console.log("sgdfgfdg");

    const newPosition = matchToScript(currentPosition, words, transcript);
    // console.log(newPosition);

    if (newPosition !== currentPosition) {
      await pusherServer.trigger(
        presentationCode,
        "update-position",
        newPosition
        // script[newPosition].timestamp
      );
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error updating the presentation progress:", error);
    return NextResponse.json(
      { error: "Error updating the presentation progress." },
      { status: 500 }
    );
  }
}
