import * as ImagePicker from "expo-image-picker";
import * as Device from "expo-device";
import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "~/components/ui/avatar";
import { AppBtn } from "~/src/components";
import { HStack } from "~/components/ui/hstack";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetIcon,
  ActionsheetItem,
  ActionsheetItemText,
} from "~/components/ui/select/select-actionsheet";
import { Camera, ImageIcon, XIcon } from "lucide-react-native";
import { useFetch, useFileUpload } from "~/src/hooks";
import { useProfileStore } from "~/src/store";
import Toast from "react-native-toast-message";
import { toUserDto, UserDto } from "~/src/types";

type ProfilePhotoUploadProps = {
  profileUri?: string;
  fullname?: string;
};

export default function ProfilePhotoUpload({
  profileUri,
  fullname,
}: ProfilePhotoUploadProps) {
  const [photo, setPhoto] = useState<any>(null);
  const [showActionsheet, setShowActionsheet] = useState(false);
  const handleClose = () => setShowActionsheet(false);

  const openCamera = async () => {
    handleClose();
    if (!Device.isDevice) {
      Alert.alert(
        "Camera Unavailable",
        "Camera is not supported on simulator."
      );
      return;
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Camera access is required to take a photo."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const selectedPhoto = result.assets[0];
      setPhoto(selectedPhoto);
      handleUpload(selectedPhoto); // ✅ pass directly
    }
  };

  const openGallery = async () => {
    handleClose();
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Gallery access is required to select a photo."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const selectedPhoto = result.assets[0];
      setPhoto(selectedPhoto);
      handleUpload(selectedPhoto); // ✅ pass directly
    }
  };

  const [progress, setProgress] = useState(0);
  const {
    data,
    isLoading,
    error,
    refetch: refetchProfile,
  } = useFetch<UserDto>("user_profile", "users/profile", { enabled: false });
  const { mutate: uploadFile, isPending } = useFileUpload<{
    profileUri: string;
    invalidateKey: "user_profile";
  }>("/users/profile/photo", {
    invalidateKeys: "profile",
    onProgress: (p) => setProgress(p),
    onSuccess: (res) => {
      Toast.show({
        text1: "Uploaded",
        text2: (res.data as any)?.message,
        type: "success",
      });
      refetchProfile();
    },
    onError: (err) =>
      Toast.show({
        text1: "Error",
        text2: err?.message,
        type: "error",
      }),
  });
  // Update handleUpload to accept an argument
  const handleUpload = async (selectedPhoto?: any) => {
    const photoUri = selectedPhoto?.uri ?? photo?.uri;
    if (!photoUri) return;
    const filename = photoUri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename ?? "");
    const type = match ? `image/${match[1]}` : `image`;
    uploadFile({
      fileUri: photoUri,
      options: {
        method: "PATCH",
        fieldName: "profileUri",
        fileInfo: {
          type: type,
        },
      },
    });
  };
  const { setProfile } = useProfileStore();
  useEffect(() => {
    if (!isLoading && data?.data && !error) {
      setProfile(toUserDto(data.data));
    }
  }, [data, isLoading]);
  return (
    <>
      <View className="flex-col justify-center items-center w-full gap-4 mb-4">
        <Avatar className="w-[130px] h-[130px] rounded-full bg-primary-500">
          {profileUri && !photo && <AvatarImage source={{ uri: profileUri }} />}
          {photo && <AvatarImage source={{ uri: photo.uri }} />}
          {!photo && !profileUri && (
            <AvatarFallbackText className="text-white text-4xl">
              {fullname}
            </AvatarFallbackText>
          )}
        </Avatar>
        {/* 🔹 Progress Bar */}
        {isPending && (
          <View className="w-56 mt-2">
            <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-primary-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </View>
            <Text className="text-xs text-center text-gray-500 mt-1">
              {progress.toFixed(0)}%
            </Text>
          </View>
        )}
        <AppBtn
          variant="default"
          w="w-56"
          onPress={() => setShowActionsheet(true)}
          loading={isPending}
          loadingText="Please wait..."
        >
          <HStack className="gap-2 items-center">
            <Text className="text-sm font-medium">Change Photo</Text>
            <Feather name="image" size={16} color="black" />
          </HStack>
        </AppBtn>
      </View>

      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent className="bg-white">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator className="bg-gray-500" />
          </ActionsheetDragIndicatorWrapper>

          <ActionsheetItem onPress={openCamera}>
            <ActionsheetIcon className="stroke-background-700" as={Camera} />
            <ActionsheetItemText>Take a Photo</ActionsheetItemText>
          </ActionsheetItem>

          <ActionsheetItem onPress={openGallery}>
            <ActionsheetIcon className="stroke-background-700" as={ImageIcon} />
            <ActionsheetItemText>Choose from Gallery</ActionsheetItemText>
          </ActionsheetItem>

          {photo && (
            <ActionsheetItem
              onPress={() => {
                setPhoto(null);
                handleClose();
              }}
            >
              <ActionsheetIcon className="stroke-red-500" as={XIcon} />
              <ActionsheetItemText className="text-red-500">
                Remove Current Photo
              </ActionsheetItemText>
            </ActionsheetItem>
          )}

          <ActionsheetItem onPress={handleClose}>
            <ActionsheetIcon className="stroke-background-700" as={XIcon} />
            <ActionsheetItemText>Cancel</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
}
