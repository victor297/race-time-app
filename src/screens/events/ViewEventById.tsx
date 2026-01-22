import { Feather, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { Image, ImageBackground } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "~/components/ui/avatar";
import { Box } from "~/components/ui/box";
import AppImages from "~/src/configs/AppImages";
import {
  EventDetailsResponse,
  EventFaqResponse,
  RaceMechanicResponse,
} from "~/src/types";
import RenderHTML from "react-native-render-html";
import { Divider } from "~/components/ui/divider";
import { CountdownCard } from "~/src/components";
import { formatEventDate } from "~/src/utils";
import { useFetch } from "~/src/hooks";
import { Skeleton } from "moti/skeleton";
const { width } = Dimensions.get("window");

export default function ViewEventByIdScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const [activeTab, setActiveTab] = useState<"Details" | "FAQs" | "Race">(
    "Details"
  );
  const [imageFailed, setImageFailed] = useState(false);

  // Reset imageFailed when eventId changes
  useEffect(() => {
    setImageFailed(false);
    setActiveTab("Details");
  }, [eventId]);

  const {
    data: eventDetails,
    isLoading: eventLoading,
    error: eventError,
    refetch,
  } = useFetch<EventDetailsResponse>(
    ["view_events", eventId ?? ""],
    `v2/events/detail/${eventId}`,
    { forceRefetch: true, enabled: false }
  );
  const { data, isLoading, error } = useFetch<EventFaqResponse>(
    ["events_faq", eventId ?? ""],
    `faqs/events/${eventId}`,
    { forceRefetch: true }
  );
  const {
    data: raceData,
    isLoading: raceLoading,
    error: raceError,
  } = useFetch<RaceMechanicResponse>(
    ["race_mechanic", eventId ?? ""],
    `race-machanics/events/${eventId}`,
    { forceRefetch: true }
  );
  useEffect(() => {
    if (eventId) refetch();
  }, [eventId]);
  return (
    <View className="flex-1">
      <SafeAreaView className="flex-1 bg-primary">
        <View className="flex-1 bg-white">
          <StatusBar barStyle="light-content" />
          <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
            <ImageBackground
              source={
                imageFailed || !eventDetails?.data.data.eventBannerUrl
                  ? AppImages.imageError
                  : { uri: eventDetails.data.data.eventBannerUrl }
              }
              onError={() => {
                console.warn(
                  "Image failed to load:",
                  eventDetails?.data.data.eventBannerUrl
                );
                setImageFailed(true);
              }}
              placeholder={AppImages.imageLoading}
              style={{ width: "100%", height: 240 }}
              imageStyle={{ resizeMode: "cover" }}
            >
              {/* 🔳 Black overlay with 10% opacity */}
              <View className="absolute inset-0 bg-black/10" />

              {/* Your content above the overlay */}
              <View className="p-4" style={{ paddingTop: 20 }}>
                <TouchableOpacity
                  onPress={() => {
                    router.back();
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  activeOpacity={0.7}
                >
                  {Platform.OS == "ios" ? (
                    <MaterialIcons
                      name="arrow-back-ios"
                      size={24}
                      color="white"
                    />
                  ) : (
                    <FontAwesome6 name="arrow-left" size={24} color="white" />
                  )}
                </TouchableOpacity>
              </View>
              <View className="absolute bottom-8 right-3">
                {eventDetails && (
                  <Box className="bg-primary-500 py-1 px-3 rounded-[12px]">
                    <Text className="text-white text-10px font-semibold text-center">
                      {eventDetails.data.data.eventType}
                    </Text>
                  </Box>
                )}
              </View>
            </ImageBackground>

            {/* Countdown card */}
            <CountdownCard
              eventDate={
                eventDetails?.data.data.eventDate ?? new Date().toISOString()
              }
              isLoading={eventLoading}
            />

            {/* Participants row */}
            <View className="px-5 mt-6">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600 text-lg">
                  Participants who have joined
                </Text>
                <TouchableOpacity onPress={() => {}} accessibilityRole="button">
                  <Box className="justify-center gap-1 items-center flex-row">
                    <Text className="text-12px text-black/50">View all</Text>
                    <Feather
                      name="arrow-right"
                      size={14}
                      color={"rgb(0 0 0 / 0.5)"}
                    />
                  </Box>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mt-4"
              >
                {eventLoading ? (
                  // Skeleton loaders for participants
                  <>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <View key={i} className="mr-3 items-center">
                        <Skeleton
                          colorMode="light"
                          width={52}
                          height={52}
                          radius="round"
                        />
                      </View>
                    ))}
                  </>
                ) : (
                  <>
                    {eventDetails?.data.data.participants
                      .slice(
                        0,
                        eventDetails.data.data.participants.length > 5
                          ? 5
                          : eventDetails.data.data.participants.length
                      )
                      .map((x, i) => (
                        <View key={i} className="mr-3 items-center">
                          <Avatar className="w-[52px] h-[52px]">
                            <AvatarImage source={{ uri: x.imageUri }} />
                            <AvatarFallbackText className="text-white">
                              {x.name}
                            </AvatarFallbackText>
                          </Avatar>
                        </View>
                      ))}
                    {eventDetails?.data?.data &&
                      eventDetails?.data?.data?.participants?.length > 5 && (
                        <View className="w-[52px] h-[52px] rounded-full bg-red-100 items-center justify-center ml-2">
                          <Text className="text-primary-500">
                            {eventDetails.data.data.participants.length - 5}+
                          </Text>
                        </View>
                      )}
                  </>
                )}
              </ScrollView>
            </View>

            {/* Tabs */}
            <View className="mt-6 border-t border-b border-gray-200">
              <View className="flex-row justify-around py-3">
                <TouchableOpacity onPress={() => setActiveTab("Details")}>
                  <Text
                    className={`text-base ${activeTab === "Details" ? "text-red-500 font-semibold" : "text-gray-400"}`}
                  >
                    Details
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab("FAQs")}>
                  <Text
                    className={`text-base ${activeTab === "FAQs" ? "text-red-500 font-semibold" : "text-gray-400"}`}
                  >
                    FAQs
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab("Race")}>
                  <Text
                    className={`text-base ${activeTab === "Race" ? "text-red-500 font-semibold" : "text-gray-400"}`}
                  >
                    Race Mechanic
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Content for tabs */}
            <View className="pt-6">
              {activeTab === "Details" && (
                <View>
                  {eventLoading ? (
                    // Skeleton loaders for Details tab
                    <View className="px-5">
                      <View className="flex-row justify-between items-start mb-4">
                        <Skeleton
                          colorMode="light"
                          width={200}
                          height={24}
                          radius={4}
                        />
                        <Skeleton
                          colorMode="light"
                          width={80}
                          height={16}
                          radius={4}
                        />
                      </View>
                      <Skeleton
                        colorMode="light"
                        width="100%"
                        height={12}
                        radius={4}
                      />
                      <View className="mt-2">
                        <Skeleton
                          colorMode="light"
                          width="95%"
                          height={12}
                          radius={4}
                        />
                      </View>
                      <View className="mt-2">
                        <Skeleton
                          colorMode="light"
                          width="90%"
                          height={12}
                          radius={4}
                        />
                      </View>
                      <View className="mt-6">
                        <Skeleton
                          colorMode="light"
                          width={120}
                          height={18}
                          radius={4}
                        />
                      </View>
                      <View className="flex-row flex-wrap mt-3">
                        {[1, 2, 3].map((i) => (
                          <View key={i} className="mr-3 mb-3">
                            <Skeleton
                              colorMode="light"
                              width={80}
                              height={32}
                              radius={16}
                            />
                          </View>
                        ))}
                      </View>
                      <View className="mt-6">
                        <Skeleton
                          colorMode="light"
                          width={width - 40}
                          height={192}
                          radius={6}
                        />
                      </View>
                    </View>
                  ) : (
                    <>
                      <View className="px-5">
                        <View className="w-full flex-1 flex-row justify-between items-start mb-2">
                          <Text className="text-xl font-bold w-72 text-wrap">
                            {eventDetails?.data.data.eventTitle}
                          </Text>
                          <Text className="text-right text-sm text-gray-500 mt-1">
                            {formatEventDate(
                              eventDetails?.data?.data?.eventDate ?? ""
                            )}
                          </Text>
                        </View>

                        <RenderHTML
                          contentWidth={width}
                          source={{
                            html:
                              eventDetails?.data?.data?.eventDescription ?? "",
                          }}
                          tagsStyles={{
                            p: {
                              color: "#333",
                              fontSize: 16,
                              lineHeight: 24,
                              marginBottom: 10,
                            },
                            strong: { fontWeight: "700", color: "#111" },
                          }}
                        />
                      </View>
                      <Divider className="my-2" />
                      <View className="px-5">
                        <Text className="mt-6 text-base font-semibold">
                          Categories
                        </Text>
                        <View className="flex-row flex-wrap mt-3">
                          {eventDetails?.data?.data?.categories.map((c, j) => (
                            <View
                              key={`cat-${j}`}
                              className="bg-gray-100 px-3 py-2 rounded-full mr-3 mb-3"
                            >
                              <Text className="text-sm text-gray-600">
                                {c.title}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                      <Divider className="my-2" />
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="pl-5 flex-1"
                      >
                        {eventDetails?.data?.data?.flyers.map((x, k) => (
                          <Image
                            key={`Images-${k}`}
                            source={{ uri: x }}
                            placeholder={AppImages.imageLoading}
                            style={{
                              width: width,
                              height: 192,
                              marginTop: 10,
                              borderRadius: 6,
                              marginRight: 10,
                            }}
                          />
                        ))}
                      </ScrollView>
                    </>
                  )}
                </View>
              )}

              {activeTab === "FAQs" && (
                <View className="px-[20px]">
                  <Text className="text-2xl font-bold">
                    FREQUENTLY ASKED QUESTIONS (FAQs)
                  </Text>

                  {/* ⏳ Loading State */}
                  {isLoading && (
                    <>
                      {[1, 2, 3].map((i) => (
                        <View key={i} className="mt-4">
                          <Skeleton
                            colorMode="light"
                            width="80%"
                            height={18}
                            radius={4}
                          />
                          <View className="mt-2">
                            <Skeleton
                              colorMode="light"
                              width="100%"
                              height={12}
                              radius={4}
                            />
                          </View>
                          <View className="mt-1">
                            <Skeleton
                              colorMode="light"
                              width="95%"
                              height={12}
                              radius={4}
                            />
                          </View>
                          <View className="mt-1">
                            <Skeleton
                              colorMode="light"
                              width="70%"
                              height={12}
                              radius={4}
                            />
                          </View>
                        </View>
                      ))}
                    </>
                  )}

                  {/* ❌ Error State */}
                  {!isLoading && error && (
                    <View className="mt-6">
                      <Text className="text-red-500 text-base text-center">
                        Failed to load FAQs. Please try again later.
                      </Text>
                    </View>
                  )}

                  {/* 📭 Empty State */}
                  {!isLoading && !error && data?.data?.data?.length === 0 && (
                    <View className="mt-6">
                      <Text className="text-gray-500 text-base text-center">
                        No FAQs available for this event yet.
                      </Text>
                    </View>
                  )}

                  {/* ✅ Data Display */}
                  {!isLoading &&
                    !error &&
                    data?.data.data &&
                    data?.data.data.length > 0 &&
                    data.data.data.map((x, k) => (
                      <React.Fragment key={`faq-${k}`}>
                        <Text className="mt-4 font-semibold">{x.question}</Text>
                        <RenderHTML
                          contentWidth={width}
                          source={{ html: x.answer }}
                          tagsStyles={{
                            p: {
                              color: "#6b7280",
                              fontSize: 16,
                              lineHeight: 24,
                              marginBottom: 10,
                            },
                            strong: { fontWeight: "700", color: "#111" },
                          }}
                        />
                      </React.Fragment>
                    ))}
                </View>
              )}

              {activeTab === "Race" && (
                <View className="px-[20px]">
                  <Text className="text-2xl font-bold">RACE MECHANIC</Text>
                  {/* ⏳ Loading State */}
                  {raceLoading && (
                    <>
                      {[1, 2, 3].map((i) => (
                        <View key={i} className="mt-4">
                          <Skeleton
                            colorMode="light"
                            width="80%"
                            height={18}
                            radius={4}
                          />
                          <View className="mt-2">
                            <Skeleton
                              colorMode="light"
                              width="100%"
                              height={12}
                              radius={4}
                            />
                          </View>
                          <View className="mt-1">
                            <Skeleton
                              colorMode="light"
                              width="95%"
                              height={12}
                              radius={4}
                            />
                          </View>
                          <View className="mt-1">
                            <Skeleton
                              colorMode="light"
                              width="70%"
                              height={12}
                              radius={4}
                            />
                          </View>
                        </View>
                      ))}
                    </>
                  )}

                  {/* ❌ Error State */}
                  {!raceLoading && raceError && (
                    <View className="mt-6">
                      <Text className="text-red-500 text-base text-center">
                        Failed to load FAQs. Please try again later.
                      </Text>
                    </View>
                  )}

                  {/* 📭 Empty State */}
                  {!raceLoading &&
                    !raceError &&
                    raceData?.data?.data?.length === 0 && (
                      <View className="mt-6">
                        <Text className="text-gray-500 text-base text-center">
                          No race mechanic available for this event yet.
                        </Text>
                      </View>
                    )}

                  {/* ✅ Data Display */}
                  {!raceLoading &&
                    !raceError &&
                    raceData?.data.data &&
                    raceData?.data.data.length > 0 &&
                    raceData.data.data.map((x, k) => (
                      <React.Fragment key={`faq-${k}`}>
                        <Text className="mt-4 font-semibold">{x.question}</Text>
                        <RenderHTML
                          contentWidth={width}
                          source={{ html: x.answer }}
                          tagsStyles={{
                            p: {
                              color: "#6b7280",
                              fontSize: 16,
                              lineHeight: 24,
                              marginBottom: 10,
                            },
                            strong: { fontWeight: "700", color: "#111" },
                          }}
                        />
                      </React.Fragment>
                    ))}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      {/* Floating bottom bar with Register button */}
      <View
        className="absolute left-0 right-0 bottom-0 px-0 bg-white pb-4"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 8,
        }}
      >
        <View className="bg-white p-3 px-5 flex-row items-center justify-between">
          <Text className="text-gray-500">Virtual Event</Text>
          {eventLoading ? (
            <ActivityIndicator size="large" color="#FD2828B2" />
          ) : !eventError && eventDetails ? (
            <>
              {eventDetails?.data.data?.registrationStatus == "registered" ? (
                <Text className="text-gray-500">Joined</Text>
              ) : (
                <TouchableOpacity
                  className="bg-red-500 px-6 py-3 rounded-full"
                  onPress={() => {
                    router.push({
                      pathname: "/modal/create-event",
                      params: { event: JSON.stringify(eventDetails) },
                    });
                  }}
                >
                  <Box className="justify-center gap-1 items-center flex-row">
                    <Text className="text-white font-semibold">
                      {eventDetails?.data.data?.registrationStatus ==
                      "pending_payment"
                        ? "Make payment"
                        : "Register"}
                    </Text>
                    <Feather name="arrow-right" size={18} color={"white"} />
                  </Box>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              <Text className="text-error-500">Unavailable</Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
}
