"use client";

import { useState } from "react";
import Link from "next/link";
import AuthCard from "@/components/AuthCard";
import { inputClass, labelClass, primaryButtonClass, linkClass } from "@/lib/ui";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [result, setResult] = useState<{ message: string; resetLink: string | null } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Forgot Password"
      subtitle="Enter your registered email or mobile number to get a reset link."
      footer={
        <Link href="/" className={linkClass}>
          Back to login selection
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Email or mobile number</label>
          <input
            required
            className={inputClass}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className={primaryButtonClass}>
          {loading ? "Generating link..." : "Send reset link"}
        </button>
      </form>

      {result && (
        <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50 p-4 text-sm text-slate-700">
          <p>{result.message}</p>
          {result.resetLink && (
            <Link
              href={result.resetLink}
              className="mt-2 inline-block font-semibold text-indigo-700 hover:underline"
            >
              Continue to reset password
            </Link>
          )}
        </div>
      )}
    </AuthCard>
  );
}
