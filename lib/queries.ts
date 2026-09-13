import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { policies, claims, products, users, faqs } from "@/db/schema";

export async function getAllPolicies() {
  return db
    .select({
      id: policies.id,
      policyNumber: policies.policyNumber,
      insuranceAmount: policies.insuranceAmount,
      premium: policies.premium,
      status: policies.status,
      startDate: policies.startDate,
      endDate: policies.endDate,
      customerName: users.name,
      customerEmail: users.email,
      productName: products.name,
    })
    .from(policies)
    .innerJoin(users, eq(policies.userId, users.id))
    .innerJoin(products, eq(policies.productId, products.id));
}

export async function getAllClaims() {
  return db
    .select({
      id: claims.id,
      claimNumber: claims.claimNumber,
      claimDate: claims.claimDate,
      amount: claims.amount,
      status: claims.status,
      description: claims.description,
      customerName: users.name,
      customerEmail: users.email,
      policyNumber: policies.policyNumber,
    })
    .from(claims)
    .innerJoin(users, eq(claims.userId, users.id))
    .innerJoin(policies, eq(claims.policyId, policies.id));
}

export async function getAllProducts() {
  return db.select().from(products);
}

export async function getUserPolicies(userId: number) {
  return db
    .select({
      id: policies.id,
      policyNumber: policies.policyNumber,
      insuranceAmount: policies.insuranceAmount,
      premium: policies.premium,
      status: policies.status,
      startDate: policies.startDate,
      endDate: policies.endDate,
      productName: products.name,
      productDescription: products.description,
    })
    .from(policies)
    .innerJoin(products, eq(policies.productId, products.id))
    .where(eq(policies.userId, userId));
}

export async function getUserClaims(userId: number) {
  return db
    .select({
      id: claims.id,
      claimNumber: claims.claimNumber,
      claimDate: claims.claimDate,
      amount: claims.amount,
      status: claims.status,
      description: claims.description,
      policyNumber: policies.policyNumber,
    })
    .from(claims)
    .innerJoin(policies, eq(claims.policyId, policies.id))
    .where(eq(claims.userId, userId));
}

export async function getFaqs() {
  return db.select().from(faqs);
}
