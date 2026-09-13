import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { getAllClaims } from "@/lib/queries";

export async function GET() {
  const session = await requireRole("admin");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ claims: await getAllClaims() });
}
