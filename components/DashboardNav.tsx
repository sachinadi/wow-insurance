import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function DashboardNav({
  brandLabel,
  userName,
  links,
}: {
  brandLabel: string;
  userName: string;
  links: { href: string; label: string }[];
}) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-8">
          <span className="text-lg font-bold text-indigo-700">
            WOW Insurance
            <span className="ml-2 rounded bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600">
              {brandLabel}
            </span>
          </span>
          <nav className="flex gap-5 text-sm font-medium text-slate-600">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-indigo-700">
                {link.label}
              </Link>
            ))}
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
