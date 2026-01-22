import { IStatItem } from "~/src/types";
import DistanceIcon from "@/assets/icons/distanceIcon.svg";
const STATS_MOCK_DATA: IStatItem[] = [
  {
    id: 1,
    library: "svg",
    SvgComponent: DistanceIcon,
    bgColor: "#60A5FA",
    value: "200.34",
    unit: "KM",
    label: "Distance(km)",
  },
  {
    id: 2,
    library: "MaterialCommunityIcons",
    name: "speedometer",
    bgColor: "#10B981",
    value: "5.57",
    unit: "KM",
    label: "Pace",
  },
  {
    id: 3,
    library: "FontAwesome5",
    name: "running",
    bgColor: "#F472B6",
    value: 10,
    label: "No. of Runs",
  },
];

export default STATS_MOCK_DATA;
