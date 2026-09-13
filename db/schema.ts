import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  role: text("role", { enum: ["admin", "enduser"] }).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  mobile: text("mobile").unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
});

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  coverageDetails: text("coverage_details").notNull(),
  premiumRange: text("premium_range").notNull(),
});

export const policies = sqliteTable("policies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  policyNumber: text("policy_number").notNull().unique(),
  productId: integer("product_id").notNull().references(() => products.id),
  insuranceAmount: real("insurance_amount").notNull(),
  premium: real("premium").notNull(),
  status: text("status", { enum: ["active", "lapsed", "cancelled"] })
    .notNull()
    .default("active"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
});

export const claims = sqliteTable("claims", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  policyId: integer("policy_id").notNull().references(() => policies.id),
  userId: integer("user_id").notNull().references(() => users.id),
  claimNumber: text("claim_number").notNull().unique(),
  claimDate: text("claim_date").notNull(),
  amount: real("amount").notNull(),
  status: text("status", {
    enum: ["submitted", "under_review", "approved", "rejected", "settled"],
  })
    .notNull()
    .default("submitted"),
  description: text("description").notNull(),
});

export const faqs = sqliteTable("faqs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  category: text("category").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
});

export const passwordResetTokens = sqliteTable("password_reset_tokens", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  token: text("token").notNull().unique(),
  type: text("type", { enum: ["username", "password"] }).notNull(),
  expiresAt: text("expires_at").notNull(),
  used: integer("used", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
});
