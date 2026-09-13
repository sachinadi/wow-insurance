import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/db/client";
import { users, passwordResetTokens } from "@/db/schema";
import { resetPasswordSchema } from "@/lib/validation";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { token, password } = parsed.data;

  const tokenRow = await db
    .select()
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.token, token),
        eq(passwordResetTokens.type, "password"),
        eq(passwordResetTokens.used, false)
      )
    )
    .get();

  if (!tokenRow || new Date(tokenRow.expiresAt).getTime() < Date.now()) {
    return NextResponse.json(
      { error: "This reset link is invalid or has expired" },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(password);
  await db
    .update(users)
    .set({ passwordHash })
    .where(eq(users.id, tokenRow.userId));

  await db
    .update(passwordResetTokens)
    .set({ used: true })
    .where(eq(passwordResetTokens.id, tokenRow.id));

  return NextResponse.json({ ok: true });
}
