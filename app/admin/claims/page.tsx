import { getAllClaims } from "@/lib/queries";
import { formatCurrency, statusBadgeClass, formatStatusLabel } from "@/lib/format";

export default async function AdminClaimsPage() {
  const claims = await getAllClaims();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Claim History</h1>
      <p className="mt-1 text-slate-500">All claims filed across every customer.</p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Claim Number</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Policy Number</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {claims.map((claim) => (
              <tr key={claim.id}>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {claim.claimNumber}
                </td>
                <td className="px-4 py-3">
                  <div className="text-slate-900">{claim.customerName}</div>
                  <div className="text-xs text-slate-500">{claim.customerEmail}</div>
                </td>
                <td className="px-4 py-3">{claim.policyNumber}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{claim.claimDate}</td>
                <td className="px-4 py-3">{formatCurrency(claim.amount)}</td>
                <td className="px-4 py-3 max-w-xs text-slate-600">{claim.description}</td>
                <td className="px-4 py-3">
                  <span className={statusBadgeClass(claim.status)}>
                    {formatStatusLabel(claim.status)}
                  </span>
                </td>
              </tr>
            ))}
            {claims.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                  No claims found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
