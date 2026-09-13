import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import DashboardNav, { type NavLink } from "@/components/DashboardNav";
import AssistantWidget from "@/components/AssistantWidget";

export const dynamic = "force-dynamic";

const links: NavLink[] = [
  { href: "/dashboard", label: "My Policy", icon: "policies" },
  { href: "/dashboard/claims", label: "Claim History", icon: "claims" },
  { href: "/dashboard/faqs", label: "FAQs", icon: "faqs" },
];

export default async function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "enduser") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav brandLabel="My Account" userName={session.name} links={links} />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <AssistantWidget label="My Insurance Assistant" />
    </div>
  );
}
