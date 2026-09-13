import { z } from "zod";

const mobileRegex = /^[0-9]{7,15}$/;

export const loginSchema = z.object({
  identifier: z.string().min(3, "Enter your email or mobile number"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email address"),
    mobile: z
      .string()
      .regex(mobileRegex, "Enter a valid mobile number (7-15 digits)"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotUsernameSchema = z.object({
  identifier: z.string().min(3, "Enter your email or mobile number"),
});

export const forgotPasswordSchema = z.object({
  identifier: z.string().min(3, "Enter your email or mobile number"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function isEmail(value: string) {
  return z.string().email().safeParse(value).success;
}
