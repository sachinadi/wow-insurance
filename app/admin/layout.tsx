import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import DashboardNav, { type NavLink } from "@/components/DashboardNav";
import AssistantWidget from "@/components/AssistantWidget";

export const dynamic = "force-dynamic";

const links: NavLink[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/policies", label: "Policy Details", icon: "policies" },
  { href: "/admin/claims", label: "Claim History", icon: "claims" },
  { href: "/admin/products", label: "Products", icon: "products" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav brandLabel="Admin" userName={session.name} links={links} />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <AssistantWidget label="Portfolio Assistant" />
    </div>
  );
}
