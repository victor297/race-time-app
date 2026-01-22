export enum ActivitySourceDto {
  STRAVA = "strava",
  GOOGLE_FIT = "googleFit",
  SAMSUNG_HEALTH = "samsungHealth",
  APPLE_HEALTH = "appleHealth",
  FITBIT = "fitbit",
}

export enum ActivityTypeDto {
  RUNNING = "running",
  CYCLING = "cycling",
  WALKING = "walking",
  SWIMMING = "swimming",
  OTHER = "other",
}
export enum ActivityStatusDto {
  VERIFIED = "verified",
  DECLINED = "declined",
  PENDING = "pending",
}
export interface UserProfileInfo {
  id: string;
  fullname: string;
  profileUri: string;
  bio: string;
}

export interface UserStats {
  followers: number;
  following: number;
  posts: number;
  isFollowing: boolean;
  canFollow: boolean;
  hasStarred: boolean;
  canStar: boolean;
}

export interface UserProfileDto {
  profile: UserProfileInfo;
  stats: UserStats;
}

export interface UserRaceStatsDto {
  distanceKm: number;
  pace: number;
  noOfRuns: number;
}

export interface UserRaceActivityDto {
  id: string;
  name: string;
  type: ActivityTypeDto;
  source: ActivitySourceDto;
  dateUtc: string;
  distanceKm: number;
  movingTimeSec: number;
  averageSpeedKmh: number;
  pacePerKm: number;
  elevationGainM: number;
  status: ActivityStatusDto;
  event: {
    id: string;
    title: string;
    uri: string;
  };
}

export interface UserPostPhotosDto {
  _id: string;
  postImageUri: string;
}

export interface JoinedRaceDto {
  event: {
    title: string;
    imageUrl: string;
    target: number; // Example: 42.195
    id: string;
    eventLocation: string;
    eventDate: string;
    eventEndDate: string;
  };
  stats: {
    distanceKm: number;
    pace: number;
    noOfRuns: number;
  };
}
export interface UserBadgesDto {
  event: {
    title: string;
    imageUrl: string;
    target: number;
    id: string;
  };
  stats: {
    distanceKm: number;
    pace: number;
    noOfRuns: number;
  };
}
export interface UserRacePositionDto {
  event: {
    title: string;
    imageUrl: string;
    target: number;
    id: string;
    category: string;
    eventLocation: string;
    eventDate: string;
    eventEndDate: string;
  };
  stats: {
    distanceKm: number;
    pace: number;
    noOfRuns: number;
  };
  positions: {
    overall: number;
    gender: number;
    time: string;
    completionTime: string;
  };
  user: {
    id: string;
    bibNumber: string;
  };
}
