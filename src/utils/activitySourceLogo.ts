import AppImages from "../configs/AppImages";
import { ActivitySourceDto } from "../types";

export function activitySourceLogo(source: ActivitySourceDto): string {
  switch (source) {
    case ActivitySourceDto.APPLE_HEALTH:
      return AppImages.appleHealth;
    case ActivitySourceDto.FITBIT:
      return AppImages.fitbit;
    case ActivitySourceDto.GOOGLE_FIT:
      return AppImages.googleFit;
    case ActivitySourceDto.SAMSUNG_HEALTH:
      return AppImages.samsungHealth;
    case ActivitySourceDto.STRAVA:
      return AppImages.strava;
  }
}
