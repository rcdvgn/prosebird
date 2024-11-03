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

export async function POST(request: Request) {
  try {
    const { script, userId } = await request.json();

    const presentationsRef = collection(db, "presentations");
    const q = query(
      presentationsRef,
      where("host", "==", userId),
      where("status", "==", "active")
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return NextResponse.json(
        { error: "You already have an active presentation." },
        { status: 400 }
      );
    }

    const formattedScript = formatScript(script.data.nodes);

    const presentation = {
      createdAt: serverTimestamp(),
      host: userId,
      status: "active",
      script: formattedScript,
      code: script.id,
    };

    const docRef = await addDoc(presentationsRef, presentation);
    const presentationCode = docRef.id;

    return new Response(presentationCode); // Send as plain text
  } catch (error) {
    console.error("Error creating presentation:", error);
    return NextResponse.json(
      { error: "Failed to create presentation" },
      { status: 500 }
    );
  }
}
