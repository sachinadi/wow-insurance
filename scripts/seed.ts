import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { users, products, faqs, policies, claims } from "../db/schema";
import { hashPassword } from "../lib/auth";

async function main() {
  // --- Seed admin ---
  const adminEmail = "admin@wowinsurance.com";
  const existingAdmin = await db
    .select()
    .from(users)
    .where(eq(users.email, adminEmail))
    .get();

  let adminPassword: string | null = null;
  if (!existingAdmin) {
    adminPassword = randomBytes(9).toString("base64url");
    await db.insert(users).values({
      role: "admin",
      name: "WOW Insurance Admin",
      email: adminEmail,
      mobile: null,
      passwordHash: await hashPassword(adminPassword),
    });
  }

  // --- Seed products ---
  const productSeed = [
    {
      name: "Health Shield Plus",
      description: "Comprehensive health insurance covering hospitalization, surgeries, and critical illness.",
      coverageDetails: "Hospitalization, day-care procedures, pre/post hospitalization expenses, critical illness cover.",
      premiumRange: "$40 - $150 / month",
    },
    {
      name: "Motor Secure",
      description: "Protects your vehicle against accidents, theft, and third-party liability.",
      coverageDetails: "Own damage cover, third-party liability, theft, natural calamities, roadside assistance.",
      premiumRange: "$20 - $80 / month",
    },
    {
      name: "Life Assure",
      description: "Term life insurance providing financial security for your family.",
      coverageDetails: "Death benefit, accidental death rider, terminal illness rider.",
      premiumRange: "$15 - $100 / month",
    },
    {
      name: "Home Guard",
      description: "Covers your home and belongings against fire, theft, and natural disasters.",
      coverageDetails: "Structure cover, contents cover, fire and allied perils, burglary.",
      premiumRange: "$10 - $50 / month",
    },
  ];

  const existingProducts = await db.select().from(products).get();
  if (!existingProducts) {
    await db.insert(products).values(productSeed);
  }

  // --- Seed FAQs ---
  const faqSeed = [
    {
      category: "Policy",
      question: "How do I find my policy number?",
      answer: "Your policy number is shown on your dashboard right after you log in, and in your policy documents.",
    },
    {
      category: "Claims",
      question: "How do I file a claim?",
      answer: "Contact our support team with your policy number and incident details. Your claim will appear in your claim history once submitted.",
    },
    {
      category: "Claims",
      question: "How long does a claim take to process?",
      answer: "Most claims are reviewed within 7-10 business days after all required documents are submitted.",
    },
    {
      category: "Payments",
      question: "What payment methods are accepted for premiums?",
      answer: "We accept credit/debit cards, net banking, and UPI for premium payments.",
    },
    {
      category: "Account",
      question: "I forgot my username, what do I do?",
      answer: "Use the 'Forgot Username' link on the login page and enter your registered email or mobile number.",
    },
    {
      category: "Account",
      question: "I forgot my password, what do I do?",
      answer: "Use the 'Forgot Password' link on the login page to reset your password via a secure reset link.",
    },
  ];

  const existingFaqs = await db.select().from(faqs).get();
  if (!existingFaqs) {
    await db.insert(faqs).values(faqSeed);
  }

  // --- Seed demo enduser with a policy and claims ---
  const demoEmail = "demo.user@example.com";
  const existingDemo = await db
    .select()
    .from(users)
    .where(eq(users.email, demoEmail))
    .get();

  if (!existingDemo) {
    const demoPasswordHash = await hashPassword("Demo@1234");
    const insertedUser = await db
      .insert(users)
      .values({
        role: "enduser",
        name: "Demo User",
        email: demoEmail,
        mobile: "9876543210",
        passwordHash: demoPasswordHash,
      })
      .returning({ id: users.id });
    const demoUserId = insertedUser[0].id;

    const allProducts = await db.select().from(products);
    const healthProduct = allProducts.find((p) => p.name === "Health Shield Plus") ?? allProducts[0];

    const insertedPolicy = await db
      .insert(policies)
      .values({
        userId: demoUserId,
        policyNumber: "WOW-POL-100001",
        productId: healthProduct.id,
        insuranceAmount: 500000,
        premium: 85,
        status: "active",
        startDate: "2025-01-15",
        endDate: "2026-01-14",
      })
      .returning({ id: policies.id });
    const demoPolicyId = insertedPolicy[0].id;

    await db.insert(claims).values([
      {
        policyId: demoPolicyId,
        userId: demoUserId,
        claimNumber: "WOW-CLM-200001",
        claimDate: "2025-04-10",
        amount: 12000,
        status: "settled",
        description: "Hospitalization due to viral fever.",
      },
      {
        policyId: demoPolicyId,
        userId: demoUserId,
        claimNumber: "WOW-CLM-200002",
        claimDate: "2025-08-02",
        amount: 4500,
        status: "under_review",
        description: "Outpatient consultation and diagnostics.",
      },
    ]);
  }

  console.log("Seed complete.");
  if (adminPassword) {
    console.log("----------------------------------------------------");
    console.log(`Seed admin email:    ${adminEmail}`);
    console.log(`Seed admin password: ${adminPassword}`);
    console.log("Save this now — it will not be shown again.");
    console.log("----------------------------------------------------");
  } else {
    console.log("Admin already existed — no new password generated.");
  }
  console.log("Demo enduser login: demo.user@example.com or 9876543210 / Demo@1234");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
