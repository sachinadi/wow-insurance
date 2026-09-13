import { ChevronDown } from "lucide-react";
import { getFaqs } from "@/lib/queries";

export default async function FaqsPage() {
  const faqs = await getFaqs();
  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">
        Frequently Asked Questions
      </h1>
      <p className="mt-1 text-slate-500">
        Answers to common questions about your policy, claims, and account.
      </p>

      <div className="mt-6 space-y-6">
        {categories.map((category) => (
          <div key={category}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-indigo-600">
              {category}
            </h2>
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm">
              {faqs
                .filter((faq) => faq.category === category)
                .map((faq) => (
                  <details key={faq.id} className="group px-4 py-3">
                    <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-slate-900 group-open:text-indigo-700">
                      {faq.question}
                      <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-180 group-open:text-indigo-600" />
                    </summary>
                    <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
                  </details>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
