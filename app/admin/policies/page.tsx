import { getAllPolicies } from "@/lib/queries";
import { formatCurrency, statusBadgeClass, formatStatusLabel } from "@/lib/format";

export default async function AdminPoliciesPage() {
  const policies = await getAllPolicies();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Policy Details</h1>
      <p className="mt-1 text-slate-500">All policies across every customer.</p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Policy Number</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Insurance Amount</th>
              <th className="px-4 py-3">Premium</th>
              <th className="px-4 py-3">Term</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {policies.map((policy) => (
              <tr key={policy.id}>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {policy.policyNumber}
                </td>
                <td className="px-4 py-3">
                  <div className="text-slate-900">{policy.customerName}</div>
                  <div className="text-xs text-slate-500">{policy.customerEmail}</div>
                </td>
                <td className="px-4 py-3">{policy.productName}</td>
                <td className="px-4 py-3">{formatCurrency(policy.insuranceAmount)}</td>
                <td className="px-4 py-3">{formatCurrency(policy.premium)}/mo</td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {policy.startDate} &rarr; {policy.endDate}
                </td>
                <td className="px-4 py-3">
                  <span className={statusBadgeClass(policy.status)}>
                    {formatStatusLabel(policy.status)}
                  </span>
                </td>
              </tr>
            ))}
            {policies.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                  No policies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
