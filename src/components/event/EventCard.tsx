import { Entypo, Feather, Octicons } from "@expo/vector-icons";
import { Dimensions, Share, Text, TouchableOpacity, View } from "react-native";
import { Box } from "~/components/ui/box";
import { Button } from "~/components/ui/button";
import { EventDto } from "~/src/types";
import { formatEventDate, formatParticipants } from "~/src/utils";
import { AnimatedView } from "../ui";
import { Image } from "expo-image";
import AppImages from "~/src/configs/AppImages";
import React, { useState } from "react";
import { router } from "expo-router";
import { useCreate } from "~/src/hooks";
import { Constants } from "~/src/utils";
import EventCardSkeleton from "./EventCardSkeleton";

const { width } = Dimensions.get("window");

interface EventCardProps {
  event?: EventDto; // event optional when loading
  isLoading?: boolean;
  refresh?: () => void;
}

export default function EventCard({
  event,
  isLoading,
  refresh,
}: EventCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  // ✅ SHARE HANDLER
  const onShare = async () => {
    if (!event) return;
    try {
      const message = `${event.eventTitle}\n\n📅 ${formatEventDate(
        event.eventDate
      )}\n📍 ${event.eventLocation || "Location to be announced"}\n\nJoin the event now!`;

      await Share.share({
        title: event.eventTitle,
        message,
        url: event.eventBannerUrl, // iOS prefers the `url` key
      });
    } catch (error: any) {
      console.error("Error sharing event:", error.message);
    }
  };

  // Show skeleton loader when loading
  if (isLoading && Constants.config.production) {
    return <EventCardSkeleton />;
  }

  return (
    <TouchableOpacity
      disabled={!event}
      onPress={() =>
        router.push({
          pathname: "/event-details",
          params: { event: JSON.stringify(event) },
        })
      }
      className="w-full flex-1"
      style={{ width: "100%" }}
    >
      <View className="mb-5 bg-white w-full">
        {/* Banner Image */}
        <AnimatedView variant="scale">
          {event && (
            <Image
              source={
                imageFailed || !event.eventBannerUrl
                  ? AppImages.imageError
                  : { uri: event.eventBannerUrl }
              }
              placeholder={AppImages.imageLoading}
              contentFit="cover"
              transition={500}
              className="w-full h-[274px]"
              alt="Event cover"
              style={{ width: "100%", height: 274, borderRadius: 4 }}
              onError={() => setImageFailed(true)}
            />
          )}
        </AnimatedView>

        {/* Icons + Participants */}
        <View className="flex flex-row justify-between items-center px-2 mt-2 w-full">
          <View className="flex flex-row flex-1 justify-start gap-4">
            <LikeComponent
              isLiked={event?.isLiked ?? false}
              eventId={event?.id ?? ""}
              refresh={refresh}
            />
            <Button variant={"link"} onPress={onShare}>
              <Octicons name="upload" size={24} color="black" />
            </Button>
          </View>

          {event && (
            <View className="flex flex-row justify-end">
              <Text className="text-gray-700 text-10px font-medium">
                {formatParticipants(event?.participants?.length ?? 0)}{" "}
                Participants Joined
              </Text>
            </View>
          )}
        </View>

        {/* Title + Arrow */}
        <View className="flex flex-1 flex-row justify-between items-center mt-2 px-2 gap-2">
          <View className="flex flex-1">
            {event && (
              <Text
                className="text-14px font-semibold text-gray-900 flex-1"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ flexShrink: 1 }}
              >
                {event.eventTitle}
              </Text>
            )}
          </View>
          <View className="flex flex-row justify-end">
            <Feather name="arrow-right" size={24} className="text-black/50" />
          </View>
        </View>

        {/* Date */}
        <View className="w-full mt-2 px-2 flex flex-1 flex-row">
          {event && (
            <Text className="w-full text-gray-500 text-12px mb-2">
              {formatEventDate(event.eventDate)}
            </Text>
          )}
        </View>

        {/* Badge */}
        <View className="absolute bottom-36 right-3">
          {event && (
            <Box className="bg-primary-500 py-1 px-3 rounded-[12px]">
              <Text className="text-white text-10px font-semibold text-center">
                {event.eventType}
              </Text>
            </Box>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const LikeComponent = ({
  isLiked,
  eventId,
  refresh,
}: {
  isLiked: boolean;
  eventId: string;
  refresh?: () => void;
}) => {
  const [like, setLike] = React.useState<boolean>(isLiked);
  const { mutate } = useCreate<any>(`v2/events/${eventId}/like`);
  const onClicked = () => {
    setLike(!like);
    try {
      mutate(
        {},
        {
          onSuccess(_, __, ___) {
            refresh && refresh();
          },
        }
      );
    } catch (err: any) {
      console.error("Error liking event:", err.message);
    }
  };
  return (
    <Button variant={"link"} onPress={onClicked}>
      {like ? (
        <Entypo name="heart" size={24} color="#FD2828" />
      ) : (
        <Entypo name="heart-outlined" size={24} color="black" />
      )}
    </Button>
  );
};
