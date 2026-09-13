import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { adminLoginSchema } from "@/lib/validation";
import { verifyPassword, signSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = adminLoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), eq(users.role, "admin")))
    .get();

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const token = await signSession({
    userId: user.id,
    role: "admin",
    name: user.name,
    email: user.email,
  });
  await setSessionCookie(token);

  return NextResponse.json({ ok: true, user: { name: user.name, email: user.email } });
}
