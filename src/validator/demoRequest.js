import { z } from "zod";

export const DemoRequestSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),

  email: z.string().trim().email("Invalid email"),

  contact: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Invalid contact number"),

  companyName: z.string().trim().min(2, "Company name is required"),
});
