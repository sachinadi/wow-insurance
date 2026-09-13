import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import DashboardNav from "@/components/DashboardNav";

export const dynamic = "force-dynamic";

const links = [
  { href: "/dashboard", label: "My Policy" },
  { href: "/dashboard/claims", label: "Claim History" },
  { href: "/dashboard/faqs", label: "FAQs" },
];

export default async function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "enduser") {
    redirect("/login/user");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav brandLabel="My Account" userName={session.name} links={links} />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
