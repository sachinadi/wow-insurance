import { NextRequest, NextResponse } from "next/server";
import { eq, or } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { registerSchema } from "@/lib/validation";
import { hashPassword, signSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { name, email, mobile, password } = parsed.data;

  const existing = await db
    .select()
    .from(users)
    .where(or(eq(users.email, email), eq(users.mobile, mobile)))
    .get();

  if (existing) {
    return NextResponse.json(
      { error: "An account with this email or mobile number already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);
  const inserted = await db
    .insert(users)
    .values({ role: "enduser", name, email, mobile, passwordHash })
    .returning({ id: users.id, name: users.name, email: users.email });

  const user = inserted[0];
  const token = await signSession({
    userId: user.id,
    role: "enduser",
    name: user.name,
    email: user.email,
  });
  await setSessionCookie(token);

  return NextResponse.json({ ok: true, user: { name: user.name, email: user.email } });
}
