"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/components/AuthCard";
import { inputClass, labelClass, primaryButtonClass, linkClass } from "@/lib/ui";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Admin Login"
      subtitle="Sign in with your admin email address and password."
      footer={
        <>
          Not an admin?{" "}
          <Link href="/login/user" className={linkClass}>
            Go to User Login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Email address</label>
          <input
            type="email"
            required
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@wowinsurance.com"
          />
        </div>
        <div>
          <label className={labelClass}>Password</label>
          <input
            type="password"
            required
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className={primaryButtonClass}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <div className="mt-4 flex justify-between text-sm">
        <Link href="/forgot-username" className={linkClass}>
          Forgot Username?
        </Link>
        <Link href="/forgot-password" className={linkClass}>
          Forgot Password?
        </Link>
      </div>
    </AuthCard>
  );
}
