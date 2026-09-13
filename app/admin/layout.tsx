import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import DashboardNav from "@/components/DashboardNav";

export const dynamic = "force-dynamic";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/policies", label: "Policy Details" },
  { href: "/admin/claims", label: "Claim History" },
  { href: "/admin/products", label: "Products" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/login/admin");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav brandLabel="Admin" userName={session.name} links={links} />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
