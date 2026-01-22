import { ApiActivityDto, ApiActivitySource } from "~/src/types";
import { mapStravaToActivity } from "./strava";
import { mapGoogleFitToActivity } from "./googleFit";
import { mapSamsungHealthToActivity } from "./samsungHealth";
import { mapAppleHealthToActivity } from "./appleHealth";
import { mapFitbitToActivity } from "./fitBit";

export function normalizeApiActivity(
  source: ApiActivitySource,
  data: any
): ApiActivityDto {
  switch (source) {
    case ApiActivitySource.STRAVA:
      return mapStravaToActivity(data);
    case ApiActivitySource.GOOGLE_FIT:
      return mapGoogleFitToActivity(data);
    case ApiActivitySource.SAMSUNG_HEALTH:
      return mapSamsungHealthToActivity(data);
    case ApiActivitySource.APPLE_HEALTH:
      return mapAppleHealthToActivity(data);
    case ApiActivitySource.FITBIT:
      return mapFitbitToActivity(data);
    default:
      throw new Error("Unknown activity source");
  }
}
