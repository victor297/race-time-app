export interface EventCoordinatesDto {
  lat: number;
  lng: number;
}

export class EventCategoryDto {
  _id: string = "";
  title: string = "";
  price: number = 0;
  withSinglet: boolean = false;
  requiresSingletSize: boolean = false;
  slots: number = 0;
  isFree: boolean = true;
}

export interface OrganizationDto {
  _id: string;
  name: string;
}
export interface IncludedItemDto {
  _id?: string; // optional since Mongo adds it automatically
  type: string; // e.g. "Certificate", "Medal", "Shirt"
  label?: string; // e.g. "Gold Medal", "Event Shirt"
  sizes?: string[]; // e.g. ["S", "M", "L"]
  isFree: boolean;
}

export class EventPackageDto {
  _id?: string;
  name: string = "";
  price: number = 0;
  description?: string;
  includedItems: IncludedItemDto[] = [];
  createdAt?: string | Date;
  isFree: boolean = true; // default value

  constructor(data: Partial<EventPackageDto>) {
    Object.assign(this, data);
    this.isFree = data.isFree ?? true;
  }
}
export interface EventDto {
  id: string;
  status: "active" | "inactive" | string;
  isSuspended: boolean;
  flyers: string[];
  organization: OrganizationDto;
  participants: any[];
  eventTitle: string;
  eventDescription: string;
  eventBannerUrl: string;
  eventType: "Virtual" | "Physical" | "Hybrid" | string;
  eventDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  eventLocation: string;
  eventCoordinates: EventCoordinatesDto;
  pricingMode: "package" | "category" | string;
  categories: EventCategoryDto[];
  packages: EventPackageDto[];
  shirtSizesAvailable: string[];
  singletSizesAvailable: string[];
  extraMerchChargeForSizes: any[];
  waiverText: string;
  requireAgreement: boolean;
  requireEmergencyContact: boolean;
  allowMultipleRegistrations: boolean;
  ageBasedValidation: boolean;
  registrationStatus:
    | "not_registered"
    | "pending_payment"
    | "registered"
    | string;
  likesCount: number;
  isLiked: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
export interface EventRegistrationPaymentStatusDto {
  status: "not_registered" | "pending_payment" | "registered";
  paymentAmount?: number;
  paidItems?: any[];
  registrationId?: string | null;
  email: string | "";
  lastName: string | "";
  firstName: string | "";
}
