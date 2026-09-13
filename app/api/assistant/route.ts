import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { askAssistant, type ChatMessage } from "@/lib/assistant";
import {
  getAllPolicies,
  getAllClaims,
  getAllProducts,
  getUserPolicies,
  getUserClaims,
  getFaqs,
} from "@/lib/queries";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const message: string = body?.message ?? "";
  const history: ChatMessage[] = Array.isArray(body?.history) ? body.history : [];

  if (!message.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const contextData =
    session.role === "admin"
      ? {
          policies: await getAllPolicies(),
          claims: await getAllClaims(),
          products: await getAllProducts(),
        }
      : {
          policies: await getUserPolicies(session.userId),
          claims: await getUserClaims(session.userId),
          faqs: await getFaqs(),
        };

  const reply = await askAssistant({
    role: session.role,
    contextData,
    message,
    history,
  });

  return NextResponse.json({ reply });
}
