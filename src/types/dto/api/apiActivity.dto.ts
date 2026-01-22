export enum ApiActivitySource {
  STRAVA = "strava",
  GOOGLE_FIT = "googleFit",
  SAMSUNG_HEALTH = "samsungHealth",
  APPLE_HEALTH = "appleHealth",
  FITBIT = "fitbit",
}

export enum ApiActivityType {
  RUNNING = "running",
  CYCLING = "cycling",
  WALKING = "walking",
  SWIMMING = "swimming",
  OTHER = "other",
}

export interface ApiActivityDto {
  id: string; // `${source}:${externalId}`
  externalId?: string;
  source: ApiActivitySource;

  name: string;
  type: ApiActivityType;

  dateUtc: string;
  dateLocal: string;

  distanceKm: number;
  movingTimeSec: number;
  elapsedTimeSec: number;
  averageSpeedKmh: number;
  pacePerKm?: number;

  elevationGainM?: number;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };

  routePolyline?: string;
  units: "metric" | "imperial";
}
