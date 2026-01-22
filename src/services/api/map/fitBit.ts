import {
  ApiActivityDto,
  ApiActivitySource,
  ApiActivityType,
} from "~/src/types";

export function mapFitbitToActivity(dto: any): ApiActivityDto {
  const distanceKm = dto.distance / 1000;
  const durationSec = dto.duration / 1000;
  const avgSpeedKmh = (dto.speed ?? distanceKm / (durationSec / 3600)) * 3.6;
  const pacePerKm = avgSpeedKmh ? 60 / avgSpeedKmh : undefined;

  const normalizedType =
    dto.activityType?.toLowerCase() === "run"
      ? ApiActivityType.RUNNING
      : dto.activityType?.toLowerCase() === "ride"
        ? ApiActivityType.CYCLING
        : ApiActivityType.OTHER;

  return {
    id: `fitbit:${dto.logId}`,
    externalId: dto.logId,
    source: ApiActivitySource.FITBIT,

    name: dto.activityName,
    type: normalizedType,

    dateUtc: dto.startTime,
    dateLocal: dto.startTime,
    distanceKm,
    movingTimeSec: durationSec,
    elapsedTimeSec: durationSec,
    averageSpeedKmh: avgSpeedKmh,
    pacePerKm,
    units: "metric",
  };
}
