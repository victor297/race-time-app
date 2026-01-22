import { Text, View } from "react-native";
import { AnimatedView } from "../../ui";

interface StatItemProps {
  value: string | number;
  label: string;
  iconBgColor: string;
  icon: React.ReactNode;
}

const StatItem = ({ value, label, iconBgColor, icon }: StatItemProps) => (
  <AnimatedView variant="scale" className="items-center">
    <View
      className="w-[58px] h-[58px] rounded-full items-center justify-center mb-2"
      style={{ backgroundColor: iconBgColor }}
    >
      {icon}
    </View>
    <Text className="text-12px font-semibold text-black">{value}</Text>
    <Text className="text-10px text-black/50 mt-1">{label}</Text>
  </AnimatedView>
);
export default StatItem;
