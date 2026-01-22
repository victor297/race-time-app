import { z } from "zod";

export const passwordResetSchema = z.object({
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
  password2: z.string().nonempty("Confirm password is required"),
});

export type PasswordResetForm = z.infer<typeof passwordResetSchema>;
