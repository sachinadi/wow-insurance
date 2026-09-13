import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { getUserClaims } from "@/lib/queries";

export async function GET() {
  const session = await requireRole("enduser");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ claims: await getUserClaims(session.userId) });
}
