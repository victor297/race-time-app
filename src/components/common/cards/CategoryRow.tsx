import {
  Entypo,
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Text, View } from "react-native";
import { IStatItem } from "~/src/types";
import { AnimatedView } from "../../ui";
export interface ICategoryRowProps {
  list: IStatItem[];
}
const ICONS_MAP = {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
  Feather,
  Entypo,
} as const;

const getIconComponent = (lib?: IStatItem["library"]) => {
  if (!lib || lib === "svg") return null;
  return ICONS_MAP[lib] ?? MaterialCommunityIcons;
};
function CategoryRow({ list }: ICategoryRowProps) {
  return (
    <View className="flex-row">
      {list.map((item, idx) => {
        const Icon = getIconComponent(item.library);
        const SvgIcon = item.SvgComponent;
        // evenly space: each item takes flex-1; center aligned
        return (
          <AnimatedView
            variant="scale"
            key={item.id ?? `${item.label}-${idx}`}
            className="flex-1 items-center"
          >
            <View
              className="w-[58px] h-[58px] rounded-full items-center justify-center mb-2"
              style={{ backgroundColor: item.bgColor ?? "#60A5FA" }} // default blue
              accessible
              accessibilityLabel={`${item.label} icon`}
            >
              {/* cast to any to avoid strict Icon type mismatches across families */}
              {item.library === "svg" && SvgIcon ? (
                <SvgIcon width={24} height={24} color="#fff" />
              ) : (
                <Icon name={item.name as any} size={22} color="#fff" />
              )}
            </View>

            <Text className="text-12px font-semibold text-black">
              {item.value}
              {item.unit ? ` ${item.unit}` : ""}
            </Text>

            <Text className="text-10px text-black/50">{item.label}</Text>
          </AnimatedView>
        );
      })}
    </View>
  );
}

export default CategoryRow;
