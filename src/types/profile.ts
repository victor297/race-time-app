import { z } from "zod";

export const UpdateProfileSchema = z.object({
  firstName: z
    .string()
    .nonempty("First Name is required")
    .regex(/^[A-Za-z ]+$/, "First Name can only contain letters"),

  lastName: z
    .string()
    .nonempty("Last Name is required")
    .regex(/^[A-Za-z ]+$/, "Last Name can only contain letters"),

  email: z.string().nonempty("Email is required").email("Enter a valid email"),

  phoneNumber: z
    .string()
    .nonempty("Phone number is required")
    .regex(/^(?:\+234|0)(80|81|90|91|70)[0-9]{8}$/, "Invalid phone number"),

  dob: z
    .string()
    .nonempty("Date of Birth is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid Date of Birth",
    }),

  bio: z.string().optional(),

  gender: z.string().nonempty("Gender is required"),

  club: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[A-Za-z ]+$/.test(val),
      "Organization/Club can only contain letters and spaces"
    ),

  city: z.string().nonempty("City is required"),
  country: z.string().nonempty("Country is required"),

  contactPerson: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[A-Za-z ]+$/.test(val),
      "Contact Person can only contain letters and spaces"
    ),

  contactPersonPhoneNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(?:\+234|0)(80|81|90|91|70)[0-9]{8}$/.test(val),
      "Invalid Emergency Contact Number"
    ),
});

export type UpdateProfileForm = z.infer<typeof UpdateProfileSchema>;
