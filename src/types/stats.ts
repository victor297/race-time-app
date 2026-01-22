export interface IStatItem {
  id?: string | number;
  /** one of the supported icon families or 'svg' */
  library?:
    | "MaterialCommunityIcons"
    | "Ionicons"
    | "FontAwesome5"
    | "Feather"
    | "Entypo"
    | "svg";
  /** icon name or 'RouteMapIcon' when using svg */
  name?: string;
  /** optional background color */
  bgColor?: string;
  /** optional svg component (for figma exports) */
  SvgComponent?: React.FC<React.SVGProps<SVGSVGElement>>;
  value: string | number;
  unit?: string;
  label: string;
}
