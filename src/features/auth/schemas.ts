import { z } from "zod";
export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, { message: "Password is required" }).max(256),
  });

export const registerSchema =z.object({
    name: z.string().trim().min(1, { message: "Name is required" }).max(256),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "minimum 8 characters required" })
      .max(256),
  });