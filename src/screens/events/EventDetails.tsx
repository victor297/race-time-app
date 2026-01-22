import { Feather, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { Image, ImageBackground } from "expo-image";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Animated,
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
  EventDto,
  EventFaqResponse,
  EventRegistrationStatusResponse,
  RaceMechanicResponse,
} from "~/src/types";
import RenderHTML from "react-native-render-html";
import { Divider } from "~/components/ui/divider";
import { CountdownCard } from "~/src/components";
import { formatEventDate } from "~/src/utils";
import { useFetch } from "~/src/hooks";
import { SkeletonText } from "~/components/ui/skeleton";
const { width, height } = Dimensions.get("window");

export default function EventDetail() {
  const { event } = useLocalSearchParams();
  const eventDetails: EventDto = JSON.parse(event as string);
  const [activeTab, setActiveTab] = useState<"Details" | "FAQs" | "Race">(
    "Details"
  );
  const [imageFailed, setImageFailed] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (showImageModal) {
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showImageModal]);

  const handleCloseModal = () => {
    // Trigger close animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowImageModal(false);
      setSelectedImage(null);
    });
  };

  // Check if event is in the past
  const isEventPast = React.useMemo(() => {
    return new Date(eventDetails.eventDate) < new Date();
  }, [eventDetails.eventDate]);
  const { data, isLoading, error } = useFetch<EventFaqResponse>(
    [`events_faq_${eventDetails.id}`],
    `faqs/events/${eventDetails.id}`
  );
  const {
    data: statusData,
    isLoading: loading,
    error: statusError,
    refetch: fetchStatus,
  } = useFetch<EventRegistrationStatusResponse>(
    [`events_registration_status_${eventDetails.id}`],
    `v2/events/${eventDetails.id}/registration-status`,
    { enabled: false }
  );
  const {
    data: raceData,
    isLoading: raceLoading,
    error: raceError,
  } = useFetch<RaceMechanicResponse>(
    [`race_mechanics_events_${eventDetails.id}`],
    `race-machanics/events/${eventDetails.id}`
  );
  React.useEffect(() => {
    if (eventDetails?.id) {
      fetchStatus();
    }
  }, [eventDetails?.id]);

  useFocusEffect(
    React.useCallback(() => {
      if (eventDetails?.id) {
        fetchStatus();
      }
    }, [eventDetails?.id])
  );

  return (
    <View className="flex-1">
      <SafeAreaView className="flex-1 bg-primary">
        <View className="flex-1 bg-white">
          <StatusBar barStyle="light-content" />
          <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
            <ImageBackground
              source={
                imageFailed || !eventDetails.eventBannerUrl
                  ? AppImages.imageError
                  : { uri: eventDetails.eventBannerUrl }
              }
              onError={() => {
                console.warn(
                  "Image failed to load:",
                  eventDetails.eventBannerUrl
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
                      {eventDetails.eventType}
                    </Text>
                  </Box>
                )}
              </View>
            </ImageBackground>

            {/* Countdown card */}
            <CountdownCard eventDate={eventDetails.eventDate} />

            {/* Participants row */}
            <View className="px-5 mt-6">
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className=" text-gray-600 text-lg">
                    Participants who have joined
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: "/all-joined-participants",
                      params: {
                        participants: JSON.stringify(eventDetails.participants),
                        eventTitle: eventDetails.eventTitle,
                      },
                    });
                  }}
                  accessibilityRole="button"
                >
                  <Box className="w-[64px] justify-end gap-1 items-center flex-row">
                    <Text className="w-[40px] text-12px text-black/50">
                      View all
                    </Text>
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
                {eventDetails.participants
                  .slice(
                    0,
                    eventDetails.participants.length > 5
                      ? 5
                      : eventDetails.participants.length
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
                {eventDetails.participants.length > 5 && (
                  <View className="w-[52px] h-[52px] rounded-full bg-red-100 items-center justify-center ml-2">
                    <Text className="text-primary-500">
                      {eventDetails.participants.length - 5}+
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>

            {/* Tabs */}
            <View className="mt-6 border-t border-b border-gray-200 px-5">
              <View className="flex-row justify-around py-3">
                <TouchableOpacity
                  onPress={() => setActiveTab("Details")}
                  className="flex w-[33%]"
                >
                  <Text
                    className={`text-base text-center w-full ${activeTab === "Details" ? "text-red-500 font-semibold" : "text-gray-400"}`}
                  >
                    Details
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setActiveTab("FAQs")}
                  className="flex w-[33%]"
                >
                  <Text
                    className={`text-base w-full text-center ${activeTab === "FAQs" ? "text-red-500 font-semibold" : "text-gray-400"}`}
                  >
                    FAQs
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setActiveTab("Race")}
                  className="flex w-[34%]"
                >
                  <Text
                    className={`text-base w-full text-center ${activeTab === "Race" ? "text-red-500 font-semibold" : "text-gray-400"}`}
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
                  <View className="px-5">
                    <View className="w-full flex-1 flex-row justify-between items-start mb-2">
                      <View className="flex-1">
                        <Text className="text-xl font-bold w-full text-wrap">
                          {eventDetails.eventTitle}
                        </Text>
                      </View>
                      <View className="items-end flex w-[110px]">
                        <Text className="w-full text-right text-sm text-gray-500 mt-1">
                          {formatEventDate(eventDetails.eventDate)}
                        </Text>
                      </View>
                    </View>

                    <RenderHTML
                      contentWidth={width}
                      source={{ html: eventDetails.eventDescription }}
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
                      {eventDetails.categories.map((c, j) => (
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
                    {eventDetails.flyers.map((x, k) => (
                      <TouchableOpacity
                        key={`Images-${k}`}
                        onPress={() => {
                          setSelectedImage(x);
                          setShowImageModal(true);
                        }}
                        activeOpacity={0.9}
                      >
                        <Image
                          source={{ uri: x }}
                          placeholder={AppImages.imageLoading}
                          contentFit="cover"
                          style={{
                            width: width,
                            height: 192,
                            marginTop: 10,
                            borderRadius: 6,
                            marginRight: 10,
                          }}
                        />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  {/* Image Zoom Modal */}
                  <Modal
                    visible={showImageModal}
                    transparent={true}
                    animationType="none"
                    onRequestClose={handleCloseModal}
                  >
                    <Animated.View
                      style={{
                        flex: 1,
                        backgroundColor: "rgba(0, 0, 0, 0.95)",
                        justifyContent: "center",
                        alignItems: "center",
                        opacity: fadeAnim,
                      }}
                    >
                      {/* Close Button */}
                      <Animated.View
                        style={{
                          position: "absolute",
                          top: 50,
                          right: 20,
                          zIndex: 10,
                          opacity: fadeAnim,
                          transform: [{ scale: fadeAnim }],
                        }}
                      >
                        <TouchableOpacity
                          onPress={handleCloseModal}
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                            borderRadius: 20,
                            padding: 8,
                          }}
                        >
                          <Feather name="x" size={24} color="white" />
                        </TouchableOpacity>
                      </Animated.View>

                      {/* Zoomed Image */}
                      <Animated.View
                        style={{
                          transform: [{ scale: scaleAnim }],
                        }}
                      >
                        <Image
                          source={{ uri: selectedImage || "" }}
                          contentFit="contain"
                          style={{ width: width, height: height }}
                        />
                      </Animated.View>
                    </Animated.View>
                  </Modal>
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
                      <SkeletonText _lines={1} className="h-2 mt-4" />
                      <SkeletonText _lines={3} className="h-2 mt-2" />
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
                      <SkeletonText _lines={1} className="h-2 mt-4" />
                      <SkeletonText _lines={3} className="h-2 mt-2" />
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
        <View className="bg-white w-full p-3 px-5 flex-row flex-1 items-center justify-between">
          <View className="w-1/2">
            <Text className="text-gray-500 w-full">
              {eventDetails.eventType} Event
            </Text>
          </View>
          <View className="w-1/2 items-end">
            {isEventPast ? (
              <Text className="w-full text-gray-500 text-right">
                Event Closed
              </Text>
            ) : loading ? (
              <ActivityIndicator size="large" color="#FD2828B2" />
            ) : !statusError && statusData ? (
              <>
                {statusData?.data.data.status == "registered" ? (
                  <Text className="w-full text-gray-500 text-right">
                    Joined
                  </Text>
                ) : (
                  <TouchableOpacity
                    className="bg-red-500 px-6 py-3 rounded-full"
                    disabled={isEventPast}
                    onPress={() => {
                      router.push({
                        pathname: "/modal/create-event",
                        params: {
                          event: JSON.stringify(eventDetails),
                          status:
                            statusData?.data.data.status == "pending_payment"
                              ? JSON.stringify(statusData?.data.data)
                              : undefined,
                        },
                      });
                    }}
                  >
                    <Box className="justify-center gap-1 items-center flex-row">
                      <Text className="text-white font-semibold">
                        {statusData?.data.data.status == "pending_payment"
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
                <Text className="text-error-500 w-full text-right">
                  Unavailable
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
