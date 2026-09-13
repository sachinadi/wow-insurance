import { NextRequest, NextResponse } from "next/server";
import { eq, or } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { forgotUsernameSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = forgotUsernameSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { identifier } = parsed.data;
  const user = await db
    .select()
    .from(users)
    .where(or(eq(users.email, identifier), eq(users.mobile, identifier)))
    .get();

  if (!user) {
    return NextResponse.json({
      ok: true,
      message: "If an account exists for that email or mobile number, its username has been located below.",
      username: null,
    });
  }

  return NextResponse.json({
    ok: true,
    message: "Account found. In a production app this would be emailed/texted to you. For this draft it is shown directly below.",
    username: user.email,
  });
}
