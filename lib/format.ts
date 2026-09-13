export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

const statusColors: Record<string, string> = {
  active: "bg-green-50 text-green-700",
  lapsed: "bg-amber-50 text-amber-700",
  cancelled: "bg-red-50 text-red-700",
  submitted: "bg-blue-50 text-blue-700",
  under_review: "bg-amber-50 text-amber-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
  settled: "bg-slate-100 text-slate-700",
};

export function statusBadgeClass(status: string) {
  return `inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
    statusColors[status] ?? "bg-slate-100 text-slate-700"
  }`;
}

export function formatStatusLabel(status: string) {
  return status.replace(/_/g, " ");
}
