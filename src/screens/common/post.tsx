import { Feather, FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { HStack } from "~/components/ui/hstack";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FieldType,
  FormField,
  FormProps,
  PostFormData,
  PostSchema,
} from "~/src/types";
import SwitchToggle from "react-native-switch-toggle";
import { AnimatedView, AppBtn, AppForm } from "~/src/components";
import { useCreate } from "~/src/hooks";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const { width } = Dimensions.get("window");
import * as Device from "expo-device";
import { useLoading } from "~/src/context";
function PostScreen() {
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
  const imageWidth = width - 80;
  const imageHeight = width * (279 / 327);
  const {
    control: control,
    handleSubmit: handleSubmit,
    formState: { errors: errors },
    reset,
  } = useForm<PostFormData>({
    resolver: zodResolver(PostSchema),
    values: {
      location: "",
      caption: "",
    },
  });
  const form: FormProps<PostFormData> = {
    control: control,
    errors: errors,
    field: [
      {
        name: "location",
        title: "Location",
        inputType: FieldType.FIELD,
        required: true,
      } as FormField,
      {
        name: "caption",
        title: "Caption",
        inputType: FieldType.MULTILINE,
        required: true,
      } as FormField,
    ],
  };
  const [postOnProfile, setPostOnProfile] = React.useState<boolean>(false);
  const { mutate, isPending } = useCreate<any>("v2/feeds", [
    ["feeds_all"],
    ["my_post_photos"],
  ]);
  const onSubmit = async (data: PostFormData) => {
    try {
      showLoading();
      const formData = new FormData();
      formData.append("location", data.location);
      formData.append("caption", data.caption);
      // formData.append("postImageUri", photo ? photo.uri : null);
      formData.append("postOnProfile", `${postOnProfile}`);
      if (photo) {
        const filename = photo.uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename ?? "");
        const type = match ? `image/${match[1]}` : `image`;

        formData.append("postImageUri", {
          uri: photo.uri,
          name: filename,
          type,
        } as any);
      }
      try {
        mutate(formData, {
          onSuccess: async (res) => {
            console.log("Response", res);
            Toast.show({
              type: "success",
              text1: "Shared!",
              text2: res.data.message ?? res.message,
            });
            reset({});
            setPhoto(null);
            setPostOnProfile(false);
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
    } catch (error) {
      hideLoading();
      console.error("Error processing image:", error);
      Alert.alert("Error", "Failed to process the image");
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="bg-white px-5 py-5 flex-row items-center justify-between">
          <View className="flex flex-row justify-start items-center gap-4">
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <FontAwesome6 name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-black/75 font-bold text-[16px]">
              Share A Post
            </Text>
          </View>
          <View className="w-28">
            <AppBtn
              loading={isPending}
              loadingText="Posting..."
              onPress={handleSubmit(onSubmit)}
              variant="default"
              className="bg-transparent gap-2 flex-row justify-center items-center"
            >
              <Text className="text-black/75 font-bold text-[14px]">Share</Text>
              <Feather name="share-2" size={24} color="black" />
            </AppBtn>
          </View>
        </View>
        <View className="flex-1 bg-[#F1F1F3]" style={{ paddingVertical: 16 }}>
          <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20 }}
            enableOnAndroid={true}
            extraScrollHeight={20}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 pb-2 bg-white pt-4 items-center rounded-[16px]">
              {photo ? (
                <Image
                  source={{ uri: photo.uri }}
                  className="rounded-[6px] mb-6"
                  resizeMode="cover"
                  style={{ width: imageWidth, height: imageWidth }}
                />
              ) : (
                <View
                  style={{ width: imageWidth, height: imageWidth }}
                  className="rounded-[6px] bg-gray-100 mb-6 items-center justify-center"
                >
                  <Text className="text-gray-400">No image selected</Text>
                </View>
              )}
              <HStack className="gap-4">
                <TouchableOpacity
                  onPress={openGallery}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  activeOpacity={0.7}
                >
                  <View className="bg-[#EDF1F3] px-[12px] py-[8px] rounded-[8px]">
                    <Feather name="image" size={24} color="black" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={openCamera}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  activeOpacity={0.7}
                >
                  <View className="bg-[#EDF1F3] px-[12px] py-[8px] rounded-[8px]">
                    <Feather name="camera" size={24} color="black" />
                  </View>
                </TouchableOpacity>
              </HStack>
              <AnimatedView variant="fade" className="mt-4 w-full px-[16px]">
                <AppForm form={form} />
                {/* <Text className="text-grey text-[10px] font-[400]">
                  Note: Posting a photo will consume 1 STAR
                </Text> */}
              </AnimatedView>
              <AnimatedView className="mt-3">
                <HStack className="justify-between w-full px-4">
                  <Text className="text-[12px] text-black/50 font-[500]">
                    Post on
                  </Text>
                  <HStack className="gap-1">
                    <Text className="text-[12px] text-black/75 font-[500]">
                      Profile and feed
                    </Text>
                    <SwitchToggle
                      switchOn={postOnProfile}
                      onPress={() => setPostOnProfile(!postOnProfile)}
                      containerStyle={{
                        width: 36,
                        height: 20,
                        borderRadius: 10,
                        padding: 5,
                      }}
                      circleStyle={{
                        width: 16,
                        height: 16,
                        borderRadius: 16,
                      }}
                      circleColorOff="#FD2828"
                      circleColorOn="#ffffff"
                      backgroundColorOff="#F1F1F3"
                      backgroundColorOn={"#FD2828"}
                    />
                  </HStack>
                </HStack>
              </AnimatedView>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default PostScreen;
