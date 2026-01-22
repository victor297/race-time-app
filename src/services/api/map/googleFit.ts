import {
  ApiActivityDto,
  ApiActivitySource,
  ApiActivityType,
} from "~/src/types";

export function mapGoogleFitToActivity(dto: any): ApiActivityDto {
  const distanceKm = dto.distance / 1000;
  const durationSec =
    (new Date(dto.endTime).getTime() - new Date(dto.startTime).getTime()) /
    1000;
  const avgSpeedKmh =
    (dto.averageSpeed ?? distanceKm / (durationSec / 3600)) * 3.6;
  const pacePerKm = avgSpeedKmh ? 60 / avgSpeedKmh : undefined;

  const normalizedType =
    dto.activityType?.toLowerCase() === "running"
      ? ApiActivityType.RUNNING
      : dto.activityType?.toLowerCase() === "cycling"
        ? ApiActivityType.CYCLING
        : ApiActivityType.OTHER;

  return {
    id: `googleFit:${dto.id ?? dto.startTime}`,
    externalId: dto.id ?? dto.startTime,
    source: ApiActivitySource.GOOGLE_FIT,

    name: dto.name ?? dto.activityType ?? "Google Fit Activity",
    type: normalizedType,

    dateUtc: dto.startTime,
    dateLocal: dto.startTime, // Google Fit usually gives local time
    distanceKm,
    movingTimeSec: durationSec,
    elapsedTimeSec: durationSec,
    averageSpeedKmh: avgSpeedKmh,
    pacePerKm,

    units: "metric",
  };
}
