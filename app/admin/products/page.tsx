import { getAllProducts } from "@/lib/queries";

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
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">
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
        ))}
      </div>
    </div>
  );
}
