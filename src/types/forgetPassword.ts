import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().nonempty("Email is required").email("Enter a valid email"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
