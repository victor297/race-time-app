import {
  ApiActivityDto,
  ApiActivitySource,
  ApiActivityType,
} from "~/src/types";

export function mapSamsungHealthToActivity(dto: any): ApiActivityDto {
  const distanceKm = dto.distance / 1000;
  const durationSec =
    (new Date(dto.endTime).getTime() - new Date(dto.startTime).getTime()) /
    1000;
  const avgSpeedKmh = (dto.speed ?? distanceKm / (durationSec / 3600)) * 3.6;
  const pacePerKm = avgSpeedKmh ? 60 / avgSpeedKmh : undefined;

  const normalizedType =
    dto.exerciseType?.toLowerCase() === "running"
      ? ApiActivityType.RUNNING
      : dto.exerciseType?.toLowerCase() === "cycling"
        ? ApiActivityType.CYCLING
        : ApiActivityType.OTHER;

  return {
    id: `samsungHealth:${dto.uuid}`,
    externalId: dto.uuid,
    source: ApiActivitySource.SAMSUNG_HEALTH,

    name: dto.name ?? dto.exerciseType ?? "Samsung Health Activity",
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
