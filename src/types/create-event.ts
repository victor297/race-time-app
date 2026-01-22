import { z } from "zod";

export const EventStep1Schema = z.object({
  firstName: z
    .string()
    .nonempty("First Name is required")
    .regex(/^[A-Za-z ]+$/, "First Name can only contain letters"),

  lastName: z
    .string()
    .nonempty("Last Name is required")
    .regex(/^[A-Za-zv]+$/, "Last Name can only contain letters"),

  nameOnBib: z
    .string()
    .nonempty("Name on Bib is required")
    .regex(
      /^[A-Za-z0-9\-_/. ]+$/,
      "Name on Bib can only contain letters and spaces"
    ),
  // bibNo: z
  //   .string()
  //   .regex(/^[A-Za-z0-9@#.\/ ]+$/, "Invalid bib number")
  //   .optional(),
  email: z.string().nonempty("Email is required").email("Enter a valid email"),
  category: z.string().nonempty("Please select category"),
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

  gender: z.string().nonempty("Gender is required"),

  club: z
    .string()
    .nonempty("Organization/Club is required")
    .regex(
      /^[A-Za-z ]+$/,
      "Organization/Club can only contain letters and spaces"
    ),

  city: z.string().nonempty("City is required"),
  country: z.string().nonempty("Country is required"),

  contactPerson: z
    .string()
    .nonempty("Emergency Contact Person is required")
    .regex(
      /^[A-Za-z ]+$/,
      "Contact Person can only contain letters and spaces"
    ),

  contactPersonPhoneNumber: z
    .string()
    .nonempty("Emergency Contact Number is required")
    .regex(
      /^(?:\+234|0)(80|81|90|91|70)[0-9]{8}$/,
      "Invalid Emergency Contact Number"
    ),
});

export type EventStep1Form = z.infer<typeof EventStep1Schema>;

export const EventStep2Schema = z.object({
  package: z.string().nonempty("Please select your package"),
  shirtSize: z.string().optional(),
  deliveryArea: z.string().optional(),
  address: z.string().nonempty("Delivery address is required"),
});

export type EventStep2Form = z.infer<typeof EventStep2Schema>;

export const PaymentCardSchema = z.object({
  name: z
    .string()
    .nonempty("Name on card is required")
    .regex(/^[A-Za-z ]+$/, "Name on card can only contain letters and spaces"),

  card: z
    .string()
    .nonempty("Card number is required")
    .regex(/^[0-9]{13,19}$/, "Card number must be between 13–19 digits"),

  cvv: z
    .string()
    .nonempty("Card CVV is required")
    .regex(/^[0-9]{3,4}$/, "CVV must be 3 or 4 digits"),

  expired: z
    .string()
    .nonempty("Card expiration date is required")
    .regex(
      /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
      "Expiration must be in MM/YY format"
    ),
});

export type PaymentCardFormData = z.infer<typeof PaymentCardSchema>;

export type PaymentDataProps = {
  total: number;
  items: PaymentDataItemsProps[];
  registrationId: string;
};
export type PaymentDataItemsProps = { name: string; amount: number };

export interface EventRegistrationDTO {
  eventId: string;
  deliveryAreaId: string;
  packageId: string;
  categoryId: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  club: string;
  contactPerson: string;
  contactPersonPhoneNumber: string;
  nameOnBib: string;
  bibNumber: string;
  shirtSize?: string;
  singletSize?: string;
}

export class EventRegistrationDto {
  static fromJson(json: any, eventId: string): EventRegistrationDTO {
    if (!json) throw new Error("Invalid registration data");

    return {
      eventId,
      deliveryAreaId: json.deliveryArea ?? "",
      packageId: json.package ?? "",
      categoryId: json.category ?? "",
      firstName: json.firstName ?? "",
      lastName: json.lastName ?? "",
      gender: json.gender ?? "",
      dob: json.dob ?? "",
      email: json.email ?? "",
      phoneNumber: json.phoneNumber ?? "",
      address: json.address ?? "",
      city: json.city ?? "",
      country: json.country ?? "",
      club: json.club ?? "",
      contactPerson: json.contactPerson ?? "",
      contactPersonPhoneNumber: json.contactPersonPhoneNumber ?? "",
      nameOnBib: json.nameOnBib ?? "",
      bibNumber: json.bibNo ?? "",
      shirtSize: json.shirtSize ?? "",
      singletSize: json.singletSize ?? "",
    };
  }
}
export type CombinedForm = EventStep1Form & EventStep2Form;
