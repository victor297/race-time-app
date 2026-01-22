import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { AppBtn } from "~/src/components";
import React, { ReactNode } from "react";
import { Avatar, AvatarFallbackText, AvatarImage } from "../ui/avatar";

type AppBarProps = {
  title?: string;
  showBack?: boolean;
  showSave?: boolean;
  saveText?: string;
  onSave?: () => void;
  centerTitle?: boolean;
  shadow?: boolean;
  savingLoading?: boolean;
  savingLoadingText?: string;
  action?: ReactNode[];
  profilePicUrl?: string;
  showProfilePic?: boolean;
};
const AppBar = (props: AppBarProps) => {
  const {
    title = "Myracetime",
    showBack = true,
    showSave = false,
    saveText = "Save",
    onSave,
    centerTitle,
    shadow = true,
    savingLoading = false,
    savingLoadingText = "Saving...",
    action,
    profilePicUrl,
    showProfilePic = false,
  } = props;
  return (
    <View className="w-full flex flex-row justify-start items-center">
      <View
        className="flex-1 bg-white p-3 px-5 py-4 flex-row items-center justify-between"
        style={[
          shadow &&
            Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 }, // 👈 bottom shadow only
                shadowOpacity: 0.15,
                shadowRadius: 4,
              },
              android: {
                elevation: 6, // creates shadow on Android
              },
            }),
        ]}
      >
        <View className="flex-1 flex-row justify-start items-center gap-4">
          {showBack && (
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              {Platform.OS == "ios" ? (
                <MaterialIcons name="arrow-back-ios" size={24} color="black" />
              ) : (
                <FontAwesome6 name="arrow-left" size={24} color="black" />
              )}
            </TouchableOpacity>
          )}
          {showProfilePic && (
            <Avatar>
              {profilePicUrl && <AvatarImage source={{ uri: profilePicUrl }} />}
              {!profilePicUrl && (
                <AvatarFallbackText className="text-white">
                  {title}
                </AvatarFallbackText>
              )}
            </Avatar>
          )}
          {title && (
            <View className="flex-1 pr-2">
              <Text
                className="text-black/75 font-bold text-[16px]"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {title}
              </Text>
            </View>
          )}
        </View>
        <View className="flex flex-row justify-end items-end">
          {showSave && (
            <View className="flex justify-end items-center flex-row px-0">
              <AppBtn
                onPress={onSave && onSave}
                variant="default"
                className="bg-transparent"
                w=""
                px={0}
                loading={savingLoading}
                loadingText={savingLoadingText}
              >
                <Text className="text-black/75 font-bold text-[14px]">
                  {saveText}
                </Text>
              </AppBtn>
            </View>
          )}
          {action &&
            action.map((node, i) => (
              <React.Fragment key={`actionn-${i}`}>{node}</React.Fragment>
            ))}
        </View>
      </View>
    </View>
  );
};

export default AppBar;
