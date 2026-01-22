import {
  ActivityDto,
  DeliveryAreasDropdown,
  DigitalAssetDto,
  EventDto,
  EventRegistrationPaymentStatusDto,
  FaqDto,
  FeedListDto,
  JoinedRaceDto,
  RaceMechanicDto,
  RaceResultDto,
  RaceResultLeaderboardDto,
  UserBadgesDto,
  UserPostPhotosDto,
  UserProfileDto,
  UserRaceActivityDto,
  UserRacePositionDto,
  UserRaceStatsDto,
} from "./dto";
import { UserDto } from "./user";
export type PaginationResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type RegisterResponse = {
  message: string;
  id: string;
};
export type LoginResponse = {
  message: string;
  token: string;
};
export type EventResponse = {
  message: string;
  pagination: PaginationResponse;
  data: EventDto[];
};
export type EventFaqResponse = {
  message: string;
  count: number;
  data: FaqDto[];
};
export type EventDetailsResponse = {
  message: string;
  data: EventDto;
};
export type RaceMechanicResponse = {
  message: string;
  count: number;
  data: RaceMechanicDto[];
};
export type ResentOtpResponse = {
  message: string;
};
export type EmailVerifyResponse = {
  message: string;
  token: string;
};
export type DeliveryAreasDropdownResponse = {
  message: string;
  data: DeliveryAreasDropdown[];
};
export type EventRegistrationStatusResponse = {
  message: string;
  data: EventRegistrationPaymentStatusDto;
};
export type RegisterForEventResponse = {
  message: string;
  data: {
    id: string;
  };
};
export type PaymentInitializeResponse = {
  message: string;
  data: {
    authorizationUrl: string;
    accessCode: string;
    reference: string;
  };
};
export type PaymentCallbackResponse = {
  message: string; // e.g. "Payment successful"
  status: "success" | "failed"; // Enum-like union for clarity
  data: {
    reference: string;
    amount: number;
    registrationId: string;
    eventId: string;
    userId: string;
  };
};

// Feeds
export type FeedResponse = {
  message: string;
  pagination: PaginationResponse;
  data: FeedListDto;
};

// Profile
export type UserProfileResponse = {
  message: string;
  data: UserProfileDto;
};
export type UpdateUserProfileResponse = {
  message: string;
  user: UserDto;
};
export type UserRaceStatsResponse = {
  message: string;
  data: UserRaceStatsDto;
};
export type UserRaceActiviResponse = {
  message: string;
  data: UserRaceActivityDto[];
};
export type UserPostPhotosResponse = {
  message: string;
  data: FeedListDto;
};
export type UserJoinedRaceResponse = {
  message: string;
  data: JoinedRaceDto[];
};
export type UserBadgesResponse = {
  message: string;
  data: UserBadgesDto[];
};
export type UserRacePositionResponse = {
  message: string;
  data: UserRacePositionDto[];
};
// --------------------
// 🔹 Race result
// --------------------
export type RaceResultResponse = {
  message: string;
  data: RaceResultDto[];
};
export type RaceResultScoreboardResponse = {
  message: string;
  data: RaceResultLeaderboardDto;
};
// Activities
export type ActivityResponse = {
  message: string;
  pagination: PaginationResponse;
  data: ActivityDto[];
};
// Digistal Assets
export type DigitalAssetResponse = {
  message: string;
  data: DigitalAssetDto[];
};
