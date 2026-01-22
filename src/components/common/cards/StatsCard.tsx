import { Text, TouchableOpacity, View } from "react-native";
import { IStatItem, UserRaceStatsDto } from "~/src/types";
import { Box } from "~/components/ui/box";
import { Feather } from "@expo/vector-icons";
import { AnimatedView, AppIcon } from "../../ui";
import { Skeleton } from "moti/skeleton";
import { Constants } from "~/src/utils";

export interface IStatsProps {
  title?: string;
  year?: string | number;
  stats: UserRaceStatsDto;
  onViewAll?: () => void;
  isLoading: boolean;
  padding?: number;
}

export default function StatsCard({
  title = "Stats",
  year = "2025",
  stats,
  onViewAll,
  isLoading,
  padding = 20,
}: IStatsProps) {
  return (
    <View className={`bg-white rounded-[12px] p-[${padding}px] shadow-none`}>
      {/* header */}
      {title && (
        <View className="flex-row justify-between items-center mb-3">
          <AnimatedView variant="slideX" direction="left">
            {isLoading && Constants.config.production ? (
              <Skeleton
                width={120}
                height={18}
                colorMode="light"
                radius="round"
              />
            ) : (
              <Text className="text-lg font-semibold text-black">
                {title} {year && <>({year})</>}
              </Text>
            )}
          </AnimatedView>

          <AnimatedView variant="slideX" direction="right" className="w-[60px] items-end">
            {isLoading && Constants.config.production ? (
              <Skeleton
                width={60}
                height={14}
                colorMode="light"
                radius="round"
              />
            ) : (
              onViewAll && (
                <TouchableOpacity
                  onPress={onViewAll}
                  accessibilityRole="button"
                  className="w-full items-end"
                >
                  <Box className="w-full justify-end gap-1 items-center flex-row">
                    <Text className="flex-1 text-right text-12px text-red-500">View all</Text>
                    <Feather name="arrow-right" size={14} color={"#ef4444"} />
                  </Box>
                </TouchableOpacity>
              )
            )}
          </AnimatedView>
        </View>
      )}

      {/* stats row */}
      <View className="flex-row justify-between px-0 w-full flex-1">
        {isLoading && Constants.config.production ? (
          // 🔹 Skeleton placeholders for 3 stat items
          Array.from({ length: 3 }).map((_, idx) => (
            <View
              key={idx}
              className="flex-1 items-center"
              style={{ opacity: 0.9 }}
            >
              <View style={{ marginBottom: 8 }}>
                <Skeleton
                  colorMode="light"
                  width={58}
                  height={58}
                  radius="round"
                />
              </View>
              <View style={{ marginBottom: 4 }}>
                <Skeleton
                  colorMode="light"
                  width={40}
                  height={12}
                  radius="round"
                />
              </View>
              <Skeleton
                colorMode="light"
                width={60}
                height={10}
                radius="round"
              />
            </View>
          ))
        ) : (
          <>
            <StatItem
              value={stats.distanceKm}
              label={"Distance(km)"}
              unit="KM"
              bgColor="#60A5FA"
              library="svg"
              name="distance"
            />
            <StatItem
              value={stats.pace}
              label={"Pace"}
              unit="KM"
              bgColor="#10B981"
              library="MaterialCommunityIcons"
              name="speedometer"
            />
            <StatItem
              value={stats.noOfRuns}
              label={"No. of Runs"}
              unit=""
              bgColor="#F472B6"
              library="FontAwesome5"
              name="running"
            />
          </>
        )}
      </View>
    </View>
  );
}

function StatItem({
  label,
  value,
  SvgComponent,
  bgColor,
  library,
  name,
  unit,
}: IStatItem) {
  return (
    <AnimatedView variant="scale" className="flex-1 items-center px-1">
      <View
        className="w-[58px] h-[58px] rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: bgColor ?? "#60A5FA" }}
        accessible
        accessibilityLabel={`${label} icon`}
      >
        <AppIcon name={name} type={library} size={22} color="#fff" />
      </View>

      <View>
        <Text className="text-12px font-semibold text-black" numberOfLines={1}>
          {value}
          {unit ? ` ${unit}` : ""}
        </Text>
      </View>

      <View className="w-[80px]">
        <Text
          className="text-10px text-black/50 text-center w-[100%]"
          numberOfLines={2}
        >
          {label}
        </Text>
      </View>
    </AnimatedView>
  );
}
