"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/components/AuthCard";
import { inputClass, labelClass, primaryButtonClass, linkClass } from "@/lib/ui";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not reset password");
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <p className="text-sm text-red-600">
        Missing reset token. Please use the link from the Forgot Password page.
      </p>
    );
  }

  if (success) {
    return (
      <p className="text-sm text-green-700">
        Password reset successfully. Redirecting to login selection...
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>New password</label>
        <input
          type="password"
          required
          className={inputClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass}>Confirm new password</label>
        <input
          type="password"
          required
          className={inputClass}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className={primaryButtonClass}>
        {loading ? "Resetting..." : "Reset password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Reset Password"
      subtitle="Choose a new password for your account."
      footer={
        <Link href="/" className={linkClass}>
          Back to login selection
        </Link>
      }
    >
      <Suspense fallback={<p className="text-sm text-slate-500">Loading...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  );
}
