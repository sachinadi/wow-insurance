import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 px-4 py-12">
      <div
        className="animate-blob absolute -left-32 -top-32 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl"
        aria-hidden
      />
      <div
        className="animate-blob absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl"
        style={{ animationDelay: "4s" }}
        aria-hidden
      />

      <div className="relative w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-indigo-700">
            <span className="brand-gradient inline-flex rounded-lg p-1.5 text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            WOW Insurance
          </Link>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-indigo-900/5 backdrop-blur">
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          )}
          <div className="mt-6">{children}</div>
        </div>
        {footer && (
          <div className="mt-6 text-center text-sm text-slate-600">
            {footer}
          </div>
        )}
      </div>
    </main>
  );
}
