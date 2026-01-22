import {
  ApiActivityDto,
  ApiActivitySource,
  ApiActivityType,
} from "~/src/types";

export function mapAppleHealthToActivity(dto: any): ApiActivityDto {
  const distanceKm = dto.distance / 1000;
  const durationSec =
    (new Date(dto.endDate).getTime() - new Date(dto.startDate).getTime()) /
    1000;
  const avgSpeedKmh = distanceKm / (durationSec / 3600);
  const pacePerKm = avgSpeedKmh ? 60 / avgSpeedKmh : undefined;

  return {
    id: `appleHealth:${dto.uuid}`,
    externalId: dto.uuid,
    source: ApiActivitySource.APPLE_HEALTH,

    name: dto.name ?? "Running",
    type: ApiActivityType.RUNNING, // can infer from HKWorkoutActivityType if needed
    dateUtc: dto.startDate,
    dateLocal: dto.startDate,
    distanceKm,
    movingTimeSec: durationSec,
    elapsedTimeSec: durationSec,
    averageSpeedKmh: avgSpeedKmh,
    pacePerKm,
    units: "metric",
  };
}
