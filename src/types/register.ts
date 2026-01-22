import { z } from "zod";

export const RegisterSchema = z
  .object({
    fullname: z
      .string()
      .nonempty("Fullname is required")
      .regex(
        /^[a-zA-Z]+(?: [a-zA-Z]+)+$/,
        "Fullname can only contain letters and spaces"
      ),
    email: z
      .string()
      .nonempty("Email is required")
      .email("Enter a valid email"),
    country: z.string().nonempty("Country is required"),
    phoneNumber: z
      .string()
      .nonempty("Phone number is required")
      .regex(/^(080|091|090|070|081)[0-9]{8}$/, "Invalid phone number"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters"),
    password2: z
      .string()
      .nonempty("Confirm password is required")
      .min(6, "Password must be at least 6 characters"),
  })
  // 🔥 Match password & confirm password
  .refine((data) => data.password === data.password2, {
    path: ["password2"], // ⬅️ attach error to password2 field
    message: "Passwords do not match",
  });

export type RegisterFormData = z.infer<typeof RegisterSchema>;
