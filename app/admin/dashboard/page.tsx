import Link from "next/link";
import { FileText, ClipboardList, Package, type LucideIcon } from "lucide-react";
import { getAllPolicies, getAllClaims, getAllProducts } from "@/lib/queries";

export default async function AdminDashboardPage() {
  const [policies, claims, products] = await Promise.all([
    getAllPolicies(),
    getAllClaims(),
    getAllProducts(),
  ]);

  const activePolicies = policies.filter((p) => p.status === "active").length;
  const openClaims = claims.filter(
    (c) => c.status === "submitted" || c.status === "under_review"
  ).length;

  const cards: { label: string; value: number; sub: string; href: string; icon: LucideIcon }[] = [
    {
      label: "Total Policies",
      value: policies.length,
      sub: `${activePolicies} active`,
      href: "/admin/policies",
      icon: FileText,
    },
    {
      label: "Total Claims",
      value: claims.length,
      sub: `${openClaims} open`,
      href: "/admin/claims",
      icon: ClipboardList,
    },
    {
      label: "Insurance Products",
      value: products.length,
      sub: "covered under the platform",
      href: "/admin/products",
      icon: Package,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">
        Admin Dashboard
      </h1>
      <p className="mt-1 text-slate-500">
        End-to-end view of policies, claims, and products.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="brand-gradient absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 transition group-hover:opacity-20" />
            <div className="brand-gradient inline-flex rounded-xl p-2.5 text-white">
              <card.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-500">{card.label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">
              {card.value}
            </p>
            <p className="mt-1 text-xs text-slate-400">{card.sub}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
