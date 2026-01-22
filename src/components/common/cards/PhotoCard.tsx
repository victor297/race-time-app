import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  GestureResponderEvent,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import AppImages from "~/src/configs/AppImages";
import { FeedDto, FeedListDto } from "~/src/types";
import { AnimatedView } from "../../ui";
import { Box } from "~/components/ui/box";
import { Skeleton } from "moti/skeleton";

export interface IPhotoProps {
  title?: string;
  images: FeedListDto;
  maxImages?: number;
  onViewAll?: () => void;
  onPressImage?: (item: FeedDto) => void;
  containerPadding?: number;
  isLoading?: boolean;
}

export default function PhotoCard({
  title = "Posts",
  images,
  maxImages = 3,
  onViewAll,
  onPressImage,
  containerPadding = 16,
  isLoading = false,
}: IPhotoProps) {
  const { width } = useWindowDimensions();

  // spacing rules
  const horizontalGap = 10; // space between images
  const sidePadding = 30; // extra padding from both sides

  // 3 columns per row
  const imageSize = Math.floor(
    (width - (horizontalGap * 2 + sidePadding * 2)) / 3
  );

  // limit images to maxImages if set
  const displayImages = images.slice(0, maxImages);

  return (
    <View className="bg-white rounded-[12px] p-[20px] shadow-none">
      {/* Header */}
      {title && (
        <View className="flex-row justify-between items-center mb-3">
          <AnimatedView variant="slideX" direction="left">
            <Text className="text-lg font-semibold text-black">{title}</Text>
          </AnimatedView>

          {onViewAll && (
            <AnimatedView variant="slideX" direction="right" className="w-[60px] items-end">
              <TouchableOpacity onPress={onViewAll} accessibilityRole="button"  className="w-full items-end">
                <Box className="w-full justify-end gap-1 items-center flex-row">
                  <Text className="flex-1 text-12px text-red-500">View all</Text>
                  <Feather name="arrow-right" size={14} color={"#ef4444"} />
                </Box>
              </TouchableOpacity>
            </AnimatedView>
          )}
        </View>
      )}

      {/* Images row */}
      {!isLoading && displayImages.length > 0 && (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: horizontalGap,
          }}
        >
          {displayImages.map((item, idx) => (
            <TouchableOpacity
              key={(item?.id ?? idx).toString()}
              activeOpacity={0.85}
              onPress={() => {
                console.log("pressed image", item?.id);
                if (item && onPressImage) {
                  onPressImage(item);
                }
              }}
              disabled={!item}
              style={{
                width: imageSize,
                height: imageSize,
                borderRadius: 12,
                overflow: "hidden",
                backgroundColor: "#F1F5F9",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item ? (
                <Image
                  source={item.postImageUri}
                  style={{ width: imageSize, height: imageSize }}
                  contentFit={item.postImageUri ? "cover" : "contain"}
                  transition={500}
                  accessible
                  accessibilityLabel={item.caption ?? `photo-${idx + 1}`}
                  placeholder={AppImages.imageLoading}
                />
              ) : (
                <View
                  style={{
                    width: imageSize,
                    height: imageSize,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text className="text-xs text-gray-300">No image</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
      {!isLoading && displayImages.length <= 0 && (
        <View className="flex flex-row justify-center items-center py-10 w-full">
          <Text className="text-gray-500 text-center">No post yet</Text>
        </View>
      )}
      {isLoading && (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: horizontalGap,
          }}
        >
          {Array.from({ length: maxImages > 3 ? 9 : maxImages }).map((_, i) => (
            <Skeleton
              key={`photos-loading-index-${i}`}
              width={imageSize}
              height={imageSize}
              colorMode="light"
              radius={12}
            ></Skeleton>
          ))}
        </View>
      )}
    </View>
  );
}
