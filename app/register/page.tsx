"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/components/AuthCard";
import { inputClass, labelClass, primaryButtonClass, linkClass } from "@/lib/ui";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="New User Registration"
      subtitle="Create an account to view your policies and claims."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login/user" className={linkClass}>
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Full name</label>
          <input
            required
            className={inputClass}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Email address</label>
          <input
            type="email"
            required
            className={inputClass}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Mobile number</label>
          <input
            required
            className={inputClass}
            value={form.mobile}
            onChange={(e) => update("mobile", e.target.value)}
            placeholder="9876543210"
          />
        </div>
        <div>
          <label className={labelClass}>Password</label>
          <input
            type="password"
            required
            className={inputClass}
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Confirm password</label>
          <input
            type="password"
            required
            className={inputClass}
            value={form.confirmPassword}
            onChange={(e) => update("confirmPassword", e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className={primaryButtonClass}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthCard>
  );
}
