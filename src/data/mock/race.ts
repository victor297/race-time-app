import { IRaceItem } from "~/src/types";

const RACES_MOCK: IRaceItem[] = [
  {
    id: "1",
    raceType: "trail_blazer",
    title: "Trail Blazers Virtual Run…",
    distanceCompleted: 30.01,
    distanceGoal: 32,
    pace: "7.18/KM",
  },
  {
    id: "2",
    raceType: "turbo_virtual",
    title: "Trail Blazers Virtual Run…",
    distanceCompleted: 8.0,
    distanceGoal: 32,
    pace: "2.45/KM",
  },
  {
    id: "3",
    raceType: "speed_lane",
    title: "Trail Blazers Virtual Run…",
    distanceCompleted: 0.0,
    distanceGoal: 21,
    pace: "0.00/KM",
  },
];

export default RACES_MOCK;
