import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppBar } from "~/components";
import { AnimatedView } from "~/src/components";
import { RaceResultDto, ScoreBoardDto } from "~/src/types";
import AppImages from "~/src/configs/AppImages";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { useLoading } from "~/src/context";
import * as Device from "expo-device";
import * as ImagePicker from "expo-image-picker";
import { formatDateToYMD } from "~/src/utils";
import { useCreate } from "~/src/hooks";
import Toast from "react-native-toast-message";
const ShareAchievementScreen = () => {
  const { event, score } = useLocalSearchParams<{
    event: string;
    score: string;
  }>();
  const race: RaceResultDto = React.useMemo(() => {
    try {
      return JSON.parse(event as string);
    } catch {
      return null;
    }
  }, [event]);
  const scoreBoard: ScoreBoardDto = React.useMemo(() => {
    try {
      return JSON.parse(score as string);
    } catch {
      return null;
    }
  }, [score]);

  const [photo, setPhoto] = useState<any>(null);
  const { showLoading, hideLoading } = useLoading();
  const openCamera = async () => {
    if (!Device.isDevice) {
      Alert.alert(
        "Camera Unavailable",
        "Camera is not supported on simulator."
      );
      return;
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera access is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) setPhoto(result.assets[0]);
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Gallery access is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) setPhoto(result.assets[0]);
  };
  const viewShotRef = React.useRef<View>(null);

  const handleSave = async () => {
    try {
      const perm = await MediaLibrary.requestPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          "Permission required",
          "We need access to your photo library to save the achievement image."
        );
        return;
      }

      const uri = await captureRef(viewShotRef, {
        format: "png",
        quality: 1,
      });

      if (!uri) {
        Alert.alert("Save failed", "Couldn't capture the preview.");
        return;
      }

      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Saved", "Achievement image saved to your photos.");
    } catch (e) {
      console.error(e);
      Alert.alert("Save failed", "Something went wrong while saving.");
    }
  };
  const { mutate, isPending } = useCreate<any>("v2/feeds", [
    ["feeds_all"],
    ["my_post_photos"],
  ]);

  const handleShare = () => {
    Alert.alert(
      "Share Achievement",
      "Share this achievement to your profile?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Share",
          onPress: () => performShare(),
        },
      ]
    );
  };

  const performShare = async () => {
    try {
      showLoading();

      // Capture the ViewShot
      const capturedUri = await captureRef(viewShotRef, {
        format: "png",
        quality: 1,
      });

      if (!capturedUri) {
        hideLoading();
        Alert.alert(
          "Capture failed",
          "Couldn't capture the achievement image."
        );
        return;
      }

      console.log(`Date ${formatDateToYMD(scoreBoard.time.finishTime)}`);
      const formData = new FormData();
      formData.append("location", race.event.eventLocation ?? "");
      formData.append("caption", race.event.title ?? "");
      formData.append("date", formatDateToYMD(race.event.eventDate) ?? "");
      formData.append("postOnProfile", true.toString());
      formData.append("result", scoreBoard.stats.distanceKm.toString());
      formData.append("unit", "KM");

      // Upload the captured image
      const filename = `achievement_${Date.now()}.png`;
      formData.append("postImageUri", {
        uri: capturedUri,
        name: filename,
        type: "image/png",
      } as any);

      try {
        mutate(formData, {
          onSuccess: async (res) => {
            console.log("Response", res);
            Toast.show({
              type: "success",
              text1: "Shared!",
              text2: res.data.message ?? res.message,
            });
            setPhoto(null);
            router.back();
            hideLoading();
          },
          onError: (error) => {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: error.message,
            });
            hideLoading();
          },
        });
      } catch (err: any) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: err.message,
        });
        hideLoading();
      }
    } catch (error: any) {
      hideLoading();
      console.error("Error processing image:", error);
      Alert.alert("Error", "Failed to process the image");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="flex-1 bg-white">
        <AppBar title="Share Your Achievements" />
        <View className="flex-1 bg-[#F1F1F3]">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              paddingHorizontal: 8,
              paddingVertical: 16,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Achievement Card Preview */}
            <View className="bg-white rounded-2xl p-4 shadow-none">
              <View className="mb-6">
                {/* User Photo Container (wrapped for snapshot) */}
                <View
                  ref={viewShotRef}
                  collapsable={false}
                  className="aspect-[3/4] bg-gray-300 rounded-2xl overflow-hidden relative"
                >
                  {/* Placeholder athlete photo */}
                  <Image
                    source={{
                      uri: photo
                        ? photo.uri
                        : "https://via.placeholder.com/400x533",
                    }}
                    contentFit="cover"
                    style={{ width: "100%", height: "100%" }}
                  />

                  {/* Black overlay 20% */}
                  <View
                    pointerEvents="none"
                    className="absolute inset-0 bg-black/20"
                  />

                  {/* App Logo */}
                  <View className="absolute top-4 right-4 bg-transparent w-12 h-12 rounded-full items-center justify-center">
                    <Image
                      source={AppImages.logo64}
                      contentFit="contain"
                      style={{ width: 32, height: 32 }}
                    />
                  </View>

                  {/* Achievement Details Overlay */}
                  <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5">
                    {/* Event Badge */}
                    <View className="bg-red-500 px-4 py-1 rounded-full self-start mb-2">
                      <Text className="text-white text-xs font-semibold">
                        {race.event.title}
                      </Text>
                    </View>

                    {/* Athlete Name */}
                    <Text className="text-white text-2xl font-bold mb-1">
                      {scoreBoard.user.fullName}
                    </Text>

                    {/* Category */}
                    <Text className="text-yellow-400 text-lg font-semibold mb-4">
                      {scoreBoard.category.title}
                    </Text>

                    {/* Stats Row */}
                    <View className="flex-row justify-between items-end">
                      {/* Official Time */}
                      <View>
                        <Text className="text-white/70 text-xs">
                          Official Time
                        </Text>
                        <Text className="text-white text-2xl font-bold">
                          {scoreBoard.time.completionTime}
                        </Text>
                      </View>

                      {/* Rankings */}
                      <View className="flex-row gap-4">
                        <View className="items-center">
                          <Text className="text-white/70 text-xs">Male</Text>
                          <Text className="text-white text-xl font-bold">
                            {scoreBoard.rankings.gender}
                            {scoreBoard.rankings.gender === 1
                              ? "st"
                              : scoreBoard.rankings.gender === 2
                                ? "nd"
                                : scoreBoard.rankings.gender === 3
                                  ? "rd"
                                  : "th"}
                          </Text>
                        </View>
                        <View className="items-center">
                          <Text className="text-white/70 text-xs">Overall</Text>
                          <Text className="text-white text-xl font-bold">
                            {scoreBoard.rankings.overall}
                            {scoreBoard.rankings.overall === 1
                              ? "st"
                              : scoreBoard.rankings.overall === 2
                                ? "nd"
                                : scoreBoard.rankings.overall === 3
                                  ? "rd"
                                  : "th"}
                          </Text>
                        </View>
                        <View className="items-center">
                          <Text className="text-white/70 text-xs">10KM</Text>
                          <Text className="text-white text-xl font-bold">
                            {scoreBoard.rankings.category}
                            {scoreBoard.rankings.category === 1
                              ? "st"
                              : scoreBoard.rankings.category === 2
                                ? "nd"
                                : scoreBoard.rankings.category === 3
                                  ? "rd"
                                  : "th"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <AnimatedView variant="fade" className="flex flex-1">
                <View className="flex-row justify-between items-center w-full">
                  <View className="flex flex-row justify-start items-center gap-3">
                    {/* Gallery Button */}
                    <TouchableOpacity
                      onPress={openGallery}
                      className="w-[44px] h-[36px] bg-[#EDF1F3] rounded-lg items-center justify-center shadow-none"
                      activeOpacity={0.7}
                    >
                      <Feather name="image" size={24} color="#374151" />
                    </TouchableOpacity>

                    {/* Camera Button */}
                    <TouchableOpacity
                      onPress={openCamera}
                      className="w-[44px] h-[36px] bg-[#EDF1F3] rounded-lg items-center justify-center shadow-none"
                      activeOpacity={0.7}
                    >
                      <Feather name="camera" size={24} color="#374151" />
                    </TouchableOpacity>
                  </View>

                  {/* Save Button */}
                  <View className="flex flex-row justify-start items-center gap-3">
                    <TouchableOpacity
                      onPress={handleSave}
                      className="w-[44px] h-[36px] bg-[#EDF1F3] rounded-lg items-center justify-center shadow-none"
                      activeOpacity={0.7}
                    >
                      <Feather name="save" size={24} color="#374151" />
                    </TouchableOpacity>

                    {/* Share Button */}
                    <TouchableOpacity
                      onPress={handleShare}
                      className="w-[44px] h-[36px] bg-[#EDF1F3] rounded-lg items-center justify-center shadow-none"
                      activeOpacity={0.7}
                    >
                      <Feather name="share-2" size={24} color="#374151" />
                    </TouchableOpacity>
                  </View>
                </View>
              </AnimatedView>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ShareAchievementScreen;
