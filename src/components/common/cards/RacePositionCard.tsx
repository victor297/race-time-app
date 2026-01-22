import { Feather } from "@expo/vector-icons";
import {
  GestureResponderEvent,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { UserRacePositionDto } from "~/src/types";
import { AnimatedView } from "../../ui";
import { Box } from "~/components/ui/box";
import { Skeleton } from "moti/skeleton";
import { router } from "expo-router";

export interface IRacePositionProps {
  headerTitle?: string;
  showViewAll?: boolean;
  onViewAllPress?: (e?: GestureResponderEvent) => void;
  items: UserRacePositionDto[];
  maxImages?: number;
  containerPadding?: number;
  isLoading?: boolean;
}

const RacePositionCard: React.FC<IRacePositionProps> = ({
  headerTitle = "Position",
  showViewAll = true,
  onViewAllPress,
  items,
  containerPadding = 16,
  maxImages = 3,
  isLoading,
}) => {
  const { width } = useWindowDimensions();

  // spacing rules
  const horizontalGap = 10; // space between images
  const sidePadding = 30; // extra padding from both sides

  // 3 columns per row
  const imageSize = Math.floor(
    (width - (horizontalGap * 2 + sidePadding * 2)) / 3
  );

  const displayImages = items.slice(0, maxImages);
  const possitionName = (position: number) => {
    if (position === 1) return "1st";
    if (position === 2) return "2nd";
    if (position === 3) return "3rd";
    return `${position}th`;
  };
  if (isLoading) {
    // Dedicated skeleton layout to avoid layout shifts
    return (
      <View className="bg-white rounded-[12px] p-[20px] shadow-none">
        {/* Header (skeleton) */}
        <View className="flex-row justify-between items-center mb-3">
          <AnimatedView variant="slideX" direction="left">
            <Skeleton colorMode="light" width={120} height={20} radius={4} />
          </AnimatedView>
          <AnimatedView variant="slideX" direction="right">
            {showViewAll ? (
              <Skeleton colorMode="light" width={70} height={16} radius={4} />
            ) : null}
          </AnimatedView>
        </View>

        {/* Grid skeleton */}
        <View className="flex-row flex-wrap" style={{ gap: horizontalGap }}>
          {Array.from({ length: maxImages }).map((_, index) => (
            <View
              key={`achieve-skel-${index}`}
              className="items-center mb-4"
              style={{ width: imageSize }}
            >
              <Skeleton colorMode="light" width={96} height={96} radius={999} />
              <View className="mt-2">
                <Skeleton colorMode="light" width={80} height={12} radius={4} />
              </View>
              <View className="mt-1">
                <Skeleton colorMode="light" width={60} height={10} radius={4} />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }
  return (
    <View className="bg-white rounded-[12px] p-[20px] shadow-none">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-3">
        <AnimatedView variant="slideX" direction="left">
          <Text className="text-lg font-semibold text-black">
            {headerTitle}
          </Text>
        </AnimatedView>
        <AnimatedView variant="slideX" direction="right" className="w-[60px] items-end">
          {showViewAll ? (
            <TouchableOpacity
              onPress={onViewAllPress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              className="w-full flex-row items-center"
            >
              <Box className="justify-end gap-1 items-center flex-row">
                <Text className="flex-1 text-12px text-red-500">View all</Text>
                <Feather name="arrow-right" size={14} color={"#ef4444"} />
              </Box>
            </TouchableOpacity>
          ) : null}
        </AnimatedView>
      </View>

      {/* Grid: max 3 columns, wraps to next row */}
      <View className="flex-row flex-wrap" style={{ gap: horizontalGap }}>
        {displayImages && displayImages.length > 0 ? (
          displayImages.map((item, index) => (
            <TouchableOpacity
              key={`reace-position-${index}`}
              style={{ width: imageSize }}
              onPress={() => {
                router.push({
                  pathname: "/modal/possition-details",
                  params: { data: JSON.stringify(item) },
                });
              }}
            >
              <View className=" items-center mb-4" style={{ width: imageSize }}>
                <View className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 items-center justify-center">
                  <Image
                    source={{ uri: item.event.imageUrl }}
                    resizeMode="cover"
                    className="w-full h-full"
                  />
                </View>

                <Text
                  numberOfLines={2}
                  className="text-sm font-semibold text-center mt-2"
                >
                  {item.event.title}
                </Text>
                <Text className="text-xs text-gray-400 text-center mt-1">
                  {possitionName(item.positions.overall)}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="w-full items-center py-6">
            <Text className="w-full text-center text-sm text-gray-400">
              You have no race positions yet
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default RacePositionCard;
