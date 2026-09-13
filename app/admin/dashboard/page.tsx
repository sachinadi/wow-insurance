import Link from "next/link";
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

  const cards = [
    {
      label: "Total Policies",
      value: policies.length,
      sub: `${activePolicies} active`,
      href: "/admin/policies",
    },
    {
      label: "Total Claims",
      value: claims.length,
      sub: `${openClaims} open`,
      href: "/admin/claims",
    },
    {
      label: "Insurance Products",
      value: products.length,
      sub: "covered under the platform",
      href: "/admin/products",
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
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
          >
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-indigo-700">
              {card.value}
            </p>
            <p className="mt-1 text-xs text-slate-400">{card.sub}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
