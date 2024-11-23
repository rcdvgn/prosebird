import { db } from "@/app/_config/fireabase";
import processScript from "@/app/_lib/processScript";
import {
  collection,
  setDoc,
  limit,
  onSnapshot,
  updateDoc,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  Timestamp,
  addDoc,
  orderBy,
  documentId,
  serverTimestamp,
} from "firebase/firestore";
import formatScript from "@/app/_lib/formatScript";
import { NextResponse } from "next/server";
import { generateUniquePresentationCode } from "@/app/_actions/actions";
export async function POST(request: Request) {
  try {
    const { script, userId, scriptParticipants } = await request.json();

    const presentationsRef = collection(db, "presentations");
    // const q = query(presentationsRef, where("host", "==", userId));
    // const querySnapshot = await getDocs(q);

    // if (!querySnapshot.empty) {
    //   return NextResponse.json(
    //     { error: "You already have an active presentation." },
    //     { status: 400 }
    //   );
    // }

    const { formattedScript, participants } = formatScript(
      script.data.nodes,
      userId,
      scriptParticipants
    );

    const generatedCode: any = await generateUniquePresentationCode();

    const presentation = {
      createdAt: serverTimestamp(),
      host: userId,
      nodes: formattedScript,
      scriptId: script.id,
      participants: participants,
      code: generatedCode,
    };

    const docRef = await addDoc(presentationsRef, presentation);
    // const docId = docRef.id;

    return new Response(generatedCode);
  } catch (error) {
    console.error("Error creating presentation:", error);
    return NextResponse.json(
      { error: "Failed to create presentation" },
      { status: 500 }
    );
  }
}
