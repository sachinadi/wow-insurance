import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  HeartPulse,
  Car,
  Home as HomeIcon,
  UserPlus,
  KeyRound,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Track your policy",
    description: "See your policy number, coverage amount, and term at a glance.",
  },
  {
    icon: ShieldCheck,
    title: "File & follow claims",
    description: "Full claim history with live status, from submitted to settled.",
  },
  {
    icon: Sparkles,
    title: "AI-powered insights",
    description: "Ask our assistant about your coverage and get instant recommendations.",
  },
];

const products = [
  { icon: HeartPulse, name: "Health" },
  { icon: Car, name: "Motor" },
  { icon: ShieldCheck, name: "Life" },
  { icon: HomeIcon, name: "Home" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden">
        <div className="brand-gradient absolute inset-0" />
        <div
          className="animate-blob absolute -left-24 top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <div
          className="animate-blob absolute right-0 top-1/3 h-80 w-80 rounded-full bg-teal-300/20 blur-3xl"
          style={{ animationDelay: "3s" }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center text-white sm:py-28">
          <span className="animate-fade-in-up inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Now with an AI insurance assistant
          </span>
          <h1
            className="animate-fade-in-up mt-6 text-4xl font-bold tracking-tight sm:text-5xl"
            style={{ animationDelay: "0.1s" }}
          >
            WOW Insurance
          </h1>
          <p
            className="animate-fade-in-up mx-auto mt-4 max-w-xl text-lg text-indigo-100"
            style={{ animationDelay: "0.2s" }}
          >
            One place to manage your policy, track claims, and get smart
            recommendations — for customers and administrators alike.
          </p>

          <div
            className="animate-fade-in-up mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href="/login"
              className="w-full rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-700 shadow-lg shadow-indigo-900/20 transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:w-auto"
            >
              <UserPlus className="h-4 w-4" />
              New User Registration
            </Link>
          </div>

          <div
            className="animate-fade-in-up mt-5 flex justify-center gap-6 text-sm text-indigo-100"
            style={{ animationDelay: "0.4s" }}
          >
            <Link href="/forgot-username" className="inline-flex items-center gap-1 hover:text-white hover:underline">
              <UserPlus className="h-3.5 w-3.5" /> Forgot Username?
            </Link>
            <Link href="/forgot-password" className="inline-flex items-center gap-1 hover:text-white hover:underline">
              <KeyRound className="h-3.5 w-3.5" /> Forgot Password?
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="inline-flex rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Products covered
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-8">
            {products.map((product) => (
              <div key={product.name} className="flex flex-col items-center gap-2 text-slate-600">
                <div className="rounded-full bg-slate-100 p-3">
                  <product.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">{product.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
