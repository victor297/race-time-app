import {
  ApiActivityDto,
  ApiActivitySource,
  ApiActivityType,
} from "~/src/types";

export function mapStravaToActivity(dto: any): ApiActivityDto {
  const distanceKm = dto.distance / 1000;
  const avgSpeedKmh = (dto.average_speed ?? 0) * 3.6;
  const pacePerKm = dto.average_speed
    ? 1000 / dto.average_speed / 60
    : undefined;

  const normalizedType =
    dto.type?.toLowerCase() === "run"
      ? ApiActivityType.RUNNING
      : dto.type?.toLowerCase() === "ride"
        ? ApiActivityType.CYCLING
        : dto.type?.toLowerCase() === "walk"
          ? ApiActivityType.WALKING
          : ApiActivityType.OTHER;

  return {
    id: `strava:${dto.id}`,
    externalId: String(dto.id),
    source: ApiActivitySource.STRAVA,

    name: dto.name ?? normalizedType,
    type: normalizedType,

    dateUtc: dto.start_date,
    dateLocal: dto.start_date_local,

    distanceKm,
    movingTimeSec: dto.moving_time,
    elapsedTimeSec: dto.elapsed_time,
    averageSpeedKmh: avgSpeedKmh,
    pacePerKm,
    elevationGainM: dto.total_elevation_gain,
    routePolyline: dto.map?.summary_polyline || undefined, // Don't send empty string

    location: {
      city: dto.location_city || "Unknown",
      state: dto.location_state || "Unknown",
      country: dto.location_country || "Unknown",
    },

    units: "metric",
  };
}
