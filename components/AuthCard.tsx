import Link from "next/link";
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" className="text-xl font-bold text-indigo-700">
            WOW Insurance
          </Link>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
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
