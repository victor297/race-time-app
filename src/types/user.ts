export interface IProfileProps {
  avatarUrl: string;
  fullName: string;
  followers?: number | string;
  following?: number | string;
  stars?: number | string;
  bio?: string;
}

export interface UserDto {
  _id: string;

  // 🔹 Basic Info
  firstName: string;
  lastName: string;
  gender?: "Male" | "Female" | "Other";
  dob?: string; // ISO date string
  age?: number;
  bio?: string;

  // 🔹 Contact Info
  email: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  club?: string;

  // 🔹 Emergency Contact
  contactPerson: string;
  contactPersonPhoneNumber: string;

  // 🔹 Role & Access
  role: "user" | "organizer" | "super_admin";
  isVerified: boolean;
  isSuspended: boolean;

  // 🔹 Organization
  organization: string | null;

  // 🔹 Profile
  profileUri?: string;

  // 🔹 Timestamps
  createdAt: string;
  updatedAt: string;

  // 🔹 Optional (frontend-only convenience)
  fullName?: string; // can be derived client-side from first + last name
}

export const toUserDto = (user: any): UserDto => {
  if (!user) throw new Error("User data is required");
  console.log("What is going on?", user);
  return {
    _id: user._id?.toString() || "",
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    gender: user.gender || undefined,
    dob: user.dob ? new Date(user.dob).toISOString() : undefined,
    age: user.age ?? undefined,
    bio: user.bio || undefined,

    email: user.email,
    phoneNumber: user.phoneNumber || undefined,
    address: user.address || undefined,
    city: user.city || undefined,
    country: user.country || undefined,
    club: user.club || undefined,

    contactPerson: user.contactPerson,
    contactPersonPhoneNumber: user.contactPersonPhoneNumber,

    role: user.role || "user",
    isVerified: Boolean(user.isVerified),
    isSuspended: Boolean(user.isSuspended),

    organization:
      user.organization?._id?.toString() || user.organization || null,

    profileUri: user.profileUri ?? "",

    createdAt: user.createdAt
      ? new Date(user.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: user.updatedAt
      ? new Date(user.updatedAt).toISOString()
      : new Date().toISOString(),

    // Frontend-only derived field
    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
  };
};
