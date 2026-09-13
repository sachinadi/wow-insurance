import { HeartPulse, Car, ShieldCheck, Home as HomeIcon, Package, type LucideIcon } from "lucide-react";
import { getAllProducts } from "@/lib/queries";

function iconForProduct(name: string): LucideIcon {
  const lower = name.toLowerCase();
  if (lower.includes("health")) return HeartPulse;
  if (lower.includes("motor")) return Car;
  if (lower.includes("life")) return ShieldCheck;
  if (lower.includes("home")) return HomeIcon;
  return Package;
}

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">
        Products Covered
      </h1>
      <p className="mt-1 text-slate-500">
        Insurance products currently offered on the platform.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {products.map((product) => {
          const Icon = iconForProduct(product.name);
          return (
            <div
              key={product.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="brand-gradient inline-flex rounded-xl p-2.5 text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                {product.name}
              </h2>
              <p className="mt-1 text-sm text-slate-600">{product.description}</p>
              <p className="mt-3 text-xs font-medium uppercase text-slate-400">
                Coverage
              </p>
              <p className="text-sm text-slate-600">{product.coverageDetails}</p>
              <p className="mt-3 text-sm font-semibold text-indigo-700">
                {product.premiumRange}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
