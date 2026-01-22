import {
  Entypo,
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import DistanceIcon from "@/assets/icons/distanceIcon.svg";
const ICONS_MAP = {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
  Feather,
  Entypo,
} as const;

type AppIconProps = {
  type?:
    | "MaterialCommunityIcons"
    | "Ionicons"
    | "FontAwesome5"
    | "Feather"
    | "Entypo"
    | "svg";
  name?: string;
  size?: number;
  color?: string;
};
const getIconComponent = (lib?: AppIconProps["type"]) => {
  if (!lib || lib === "svg") return null;
  return ICONS_MAP[lib] ?? MaterialCommunityIcons;
};
const AppIcon = ({ type, size = 24, color = "#fff", name }: AppIconProps) => {
  const Icon = getIconComponent(type);
  const SvgIcon: React.FC<React.SVGProps<SVGSVGElement>> = DistanceIcon;
  if (type === "svg" && name === "distance") {
    return <SvgIcon width={size} height={size} color={color} />;
  }
  return <Icon name={name as any} size={size} color={color} />;
};
export default AppIcon;
