export type AchievementType = "turbo_virtual" | "speed_lane" | "trail_blazer";

export interface IAchievementItem {
  id?: string | number;
  type: AchievementType; // used to pick local image
  title: string; // e.g. 'Speed Lane' or 'Turbo Virtual'
  subtitle: string; // e.g. '35 KM' or '1st Position'
}
