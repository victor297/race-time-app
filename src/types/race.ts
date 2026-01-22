export type RaceType = "turbo_virtual" | "speed_lane" | "trail_blazer";
export interface IRaceItem {
  id: string | number;
  raceType: RaceType;
  title: string;
  distanceCompleted: number; // numeric km value, e.g. 30.01
  distanceGoal: number; // numeric km goal, e.g. 32
  pace?: string; // optional text like '7.18/KM'
}
