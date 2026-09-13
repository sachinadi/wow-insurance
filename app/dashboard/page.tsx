import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getUserPolicies, getUserClaims } from "@/lib/queries";
import { formatCurrency, statusBadgeClass, formatStatusLabel } from "@/lib/format";

export default async function UserDashboardPage() {
  const session = await getSession();
  const [policies, claims] = await Promise.all([
    getUserPolicies(session!.userId),
    getUserClaims(session!.userId),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">
        Welcome back, {session!.name}
      </h1>
      <p className="mt-1 text-slate-500">
        Here is a summary of your insurance policy.
      </p>

      {policies.length === 0 && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
          You don&apos;t have any policies yet. Contact support to get started.
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {policies.map((policy) => (
          <div
            key={policy.id}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase text-slate-400">
                  Policy Number
                </p>
                <p className="text-lg font-bold text-indigo-700">
                  {policy.policyNumber}
                </p>
              </div>
              <span className={statusBadgeClass(policy.status)}>
                {formatStatusLabel(policy.status)}
              </span>
            </div>

            <p className="mt-4 text-sm text-slate-500">{policy.productName}</p>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium uppercase text-slate-400">
                  Insurance Amount
                </p>
                <p className="text-xl font-semibold text-slate-900">
                  {formatCurrency(policy.insuranceAmount)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-slate-400">
                  Premium
                </p>
                <p className="text-xl font-semibold text-slate-900">
                  {formatCurrency(policy.premium)}/mo
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Coverage period: {policy.startDate} &rarr; {policy.endDate}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Claims
          </h2>
          <Link href="/dashboard/claims" className="text-sm text-indigo-600 hover:underline">
            View all
          </Link>
        </div>
        {claims.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No claims filed yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {claims.slice(0, 3).map((claim) => (
              <li key={claim.id} className="flex items-center justify-between py-2 text-sm">
                <span className="text-slate-700">
                  {claim.claimNumber} &middot; {claim.claimDate}
                </span>
                <span className={statusBadgeClass(claim.status)}>
                  {formatStatusLabel(claim.status)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
