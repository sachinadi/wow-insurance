"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  FileText,
  ClipboardList,
  Package,
  HelpCircle,
} from "lucide-react";
import LogoutButton from "./LogoutButton";

const iconMap = {
  dashboard: LayoutDashboard,
  policies: FileText,
  claims: ClipboardList,
  products: Package,
  faqs: HelpCircle,
};

export type NavIconName = keyof typeof iconMap;
export type NavLink = { href: string; label: string; icon: NavIconName };

export default function DashboardNav({
  brandLabel,
  userName,
  links,
}: {
  brandLabel: string;
  userName: string;
  links: NavLink[];
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <span className="brand-gradient inline-flex rounded-lg p-1.5 text-white">
              <ShieldCheck className="h-4 w-4" />
            </span>
            WOW Insurance
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
              {brandLabel}
            </span>
          </span>
          <nav className="flex gap-1 text-sm font-medium text-slate-600">
            {links.map((link) => {
              const Icon = iconMap[link.icon];
              const active =
                pathname === link.href ||
                (link.href !== "/dashboard" &&
                  link.href !== "/admin/dashboard" &&
                  pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                    active
                      ? "bg-indigo-50 text-indigo-700"
                      : "hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">{userName}</span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
