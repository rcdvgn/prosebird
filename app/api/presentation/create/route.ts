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

import { encode } from "@/app/_utils/idEncoder";

export async function POST(request: Request) {
  try {
    const { script, userId } = await request.json();

    const presentationsRef = collection(db, "presentations");
    const q = query(presentationsRef, where("host", "==", userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return NextResponse.json(
        { error: "You already have an active presentation." },
        { status: 400 }
      );
    }

    const formattedScript = formatScript(script.data.nodes);

    // console.log("formatted script: " + formattedScript);

    const presentation = {
      createdAt: serverTimestamp(),
      host: userId,
      nodes: formattedScript,
      scriptId: script.id,
    };

    const docRef = await addDoc(presentationsRef, presentation);
    const docId = docRef.id;

    const presentationCode: any = encode(docId);
    console.log("Encoded ID:", presentationCode);

    return new Response(docId);
  } catch (error) {
    console.error("Error creating presentation:", error);
    return NextResponse.json(
      { error: "Failed to create presentation" },
      { status: 500 }
    );
  }
}
