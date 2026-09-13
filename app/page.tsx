import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-indigo-700">WOW Insurance</h1>
        <p className="mt-2 text-slate-600">
          Sign in to manage policies, products, and claims.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <Link
            href="/login/admin"
            className="rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              Admin Login
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              For administrators who monitor policies, products, and claims
              end to end.
            </p>
          </Link>

          <Link
            href="/login/user"
            className="rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              User Login
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              For customers to check their policy, products, and claim
              history.
            </p>
          </Link>
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">
            New here?
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Create a customer account to get started.
          </p>
          <Link
            href="/register"
            className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            New User Registration
          </Link>
        </div>

        <div className="mt-6 flex justify-center gap-6 text-sm">
          <Link href="/forgot-username" className="text-indigo-600 hover:underline">
            Forgot Username?
          </Link>
          <Link href="/forgot-password" className="text-indigo-600 hover:underline">
            Forgot Password?
          </Link>
        </div>
      </div>
    </main>
  );
}
