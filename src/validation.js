import { z } from "zod";
export const registerSchema = z.object({
  username: z.string().min(1, "username is invalid"),
  password: z.string().min(8, "password is invalid"),
});
export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const favoriteSchema = z.object({
  entity_type: z.enum(["anime", "manga"], { message: "entity_type Must be anime Or manga" }),
  entity_id: z.number(),
  title: z.string().min(1),
});
