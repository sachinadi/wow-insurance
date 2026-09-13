import { NextRequest, NextResponse } from "next/server";
import { eq, or } from "drizzle-orm";
import { randomBytes } from "crypto";
import { db } from "@/db/client";
import { users, passwordResetTokens } from "@/db/schema";
import { forgotPasswordSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = forgotPasswordSchema.safeParse(body);
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
      message: "If an account exists for that email or mobile number, a reset link has been generated below.",
      resetLink: null,
    });
  }

  const token = randomBytes(24).toString("base64url");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  await db.insert(passwordResetTokens).values({
    userId: user.id,
    token,
    type: "password",
    expiresAt,
  });

  return NextResponse.json({
    ok: true,
    message: "In a production app this link would be emailed/texted to you. For this draft it is shown directly below (valid 1 hour).",
    resetLink: `/reset-password?token=${token}`,
  });
}
