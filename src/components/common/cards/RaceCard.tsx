import { Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { JoinedRaceDto } from "~/src/types";
import { AnimatedView } from "../../ui";
import { Box } from "~/components/ui/box";
import { Feather } from "@expo/vector-icons";
import { Skeleton } from "moti/skeleton";
import { Constants } from "~/src/utils";
import { Image } from "expo-image";
import AppImages from "~/src/configs/AppImages";
import { router } from "expo-router";

const getProgressColor = (progress: number) => {
  const p = Math.max(0, Math.min(100, progress));
  if (p <= 20) return "#9CA3AF"; // 0-20 grey
  if (p <= 40) return "#F97316"; // 21-40 orange
  if (p <= 60) return "#FBBF24"; // 41-60 yellow
  if (p <= 80) return "#0EA5FF"; // 61-80 blue
  return "#22C55E"; // 81-100 green
};

/** simple circular progress using react-native-svg */
function CircularProgress({
  size = 56,
  strokeWidth = 6,
  progress = 0,
  color = "#0EA5FF",
}: {
  size?: number;
  strokeWidth?: number;
  progress?: number; // 0 - 100
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const strokeDashoffset = circumference * (1 - clampedProgress / 100);

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg width={size} height={size}>
        {/* background circle */}
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* progress arc (starts at top by rotating -90deg) */}
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </Svg>

      {/* percentage text centered */}
      <View
        style={{
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text className="text-sm font-semibold text-gray-700">{`${Math.round(clampedProgress)}%`}</Text>
      </View>
    </View>
  );
}

export interface IRaceProps {
  title?: string;
  races: JoinedRaceDto[];
  onViewAll?: () => void;
  onPressRace?: (race: JoinedRaceDto) => void;
  isLoading?: boolean;
  maxItems?: number;
  showDetailsButton?: boolean;
  user: {
    name: string;
    userId: string;
  };
}
export default function RaceCard({
  title = "Joined Races",
  races,
  onViewAll,
  onPressRace,
  isLoading,
  maxItems = 3,
  showDetailsButton = true,
  user,
}: IRaceProps) {
  // limit images to maxImages if set
  const displayRaces = races.slice(0, maxItems);
  return (
    <View className="bg-white rounded-[12px] p-[20px] shadow-none">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-3">
        <AnimatedView variant="slideX" direction="left">
          <Skeleton.Group
            show={(isLoading ?? false) && Constants.config.production}
          >
            <Skeleton colorMode="light" width={140} height={20} radius={4}>
              <Text className="text-lg font-semibold text-black">{title}</Text>
            </Skeleton>
          </Skeleton.Group>
        </AnimatedView>

        {onViewAll && (
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
        )}
      </View>

      {/* Race list or skeleton */}
      <View>
        <Skeleton.Group
          show={(isLoading ?? false) && Constants.config.production}
        >
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <AnimatedView
                variant="scaleY"
                direction="bottom"
                key={`race-skel-${idx}`}
              >
                <View className="flex-row items-center justify-between py-3">
                  {/* left: badge skeleton */}
                  <Skeleton
                    colorMode="light"
                    width={56}
                    height={56}
                    radius={28}
                  />
                  {/* middle skeleton texts */}
                  <View className="flex-1 px-3">
                    <View className="mb-2">
                      <Skeleton
                        colorMode="light"
                        width={160}
                        height={16}
                        radius={4}
                      />
                    </View>
                    <View className="mb-1">
                      <Skeleton
                        colorMode="light"
                        width={140}
                        height={12}
                        radius={4}
                      />
                    </View>
                    <Skeleton
                      colorMode="light"
                      width={100}
                      height={12}
                      radius={4}
                    />
                  </View>
                  {/* right circular progress placeholder */}
                  <Skeleton
                    colorMode="light"
                    width={56}
                    height={56}
                    radius={28}
                  />
                </View>
              </AnimatedView>
            ))
          ) : displayRaces.length <= 0 ? (
            <EmptyState />
          ) : (
            displayRaces.map((r, i) => {
              const progressPercent =
                r.event.target > 0
                  ? (r.stats.distanceKm / r.event.target) * 100
                  : 0;
              const progressColor = getProgressColor(progressPercent);
              return (
                <AnimatedView
                  variant="scaleY"
                  direction="bottom"
                  key={`race-index-${i}`}
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      if (showDetailsButton) {
                        router.push({
                          pathname: "/modal/race-details",
                          params: {
                            eventId: r.event.id,
                            name: r.event.title,
                            imageUri: r.event.imageUrl,
                            target: r.event.target,
                            fullname: user.name,
                            location: r.event.eventLocation,
                            date: r.event.eventDate,
                          },
                        });
                      }
                    }}
                    className="flex-row items-center justify-between py-3"
                  >
                    {/* left: badge */}
                    <ImageComponent uri={r.event.imageUrl} />
                    {/* middle: title & meta */}
                    <View className="flex-1 px-3">
                      <Text
                        numberOfLines={1}
                        className="text-base font-semibold text-black"
                      >
                        {r.event.title}
                      </Text>
                      <Text className="text-sm text-gray-400 mt-1">
                        {`${r.stats.distanceKm.toFixed(2)}KM OF ${r.event.target}KM`}
                      </Text>
                      <Text className="text-sm text-gray-400 mt-0.5">
                        {r.stats.pace ?? "0.00"} /KM
                      </Text>
                    </View>
                    {/* right: circular progress */}
                    <View style={{ width: 64, alignItems: "center" }}>
                      <CircularProgress
                        size={56}
                        strokeWidth={6}
                        progress={Math.round(progressPercent)}
                        color={progressColor}
                      />
                    </View>
                  </TouchableOpacity>
                </AnimatedView>
              );
            })
          )}
        </Skeleton.Group>
      </View>
    </View>
  );
}

const EmptyState = () => {
  return (
    <View className="items-center justify-center py-10">
      <Image
        source={AppImages.runAlt2}
        contentFit="contain"
        style={{ width: 100, height: 100, opacity: 0.9 }}
      />
      <Text className="text-base font-semibold text-gray-800 mt-4">
        No races yet
      </Text>
      <View className="w-full "><Text className="flex-1 text-center text-sm text-gray-500 mt-1">
        Join a race to start tracking your progress.
      </Text></View>
    </View>
  );
};

const ImageComponent = ({ uri }: { uri: string }) => {
  if (!uri)
    return (
      <Image
        source={AppImages.logo}
        contentFit="contain"
        style={{ width: 50, height: 50, borderRadius: 50 }}
      />
    );
  return (
    <Image
      source={{ uri }}
      style={{ width: 50, height: 50, borderRadius: 50 }}
      contentFit="cover"
      className="rounded-lg"
    />
  );
};
