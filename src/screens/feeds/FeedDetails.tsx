import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  Dimensions,
  Animated,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppBar } from "~/components";
import { Box } from "~/components/ui/box";
import {
  DeleteOrFlagComponent,
  LikeComponent,
} from "~/src/components/feeds/FeedsCard";
import AppImages from "~/src/configs/AppImages";
import { FeedDto } from "~/src/types";
import { getPostYear, timeAgo } from "~/src/utils";

const { width, height } = Dimensions.get("window");

const FeedDetails = () => {
  const { feed, validate } = useLocalSearchParams();
  console.log("feed details params", feed);
  const feedDetails: FeedDto = React.useMemo(() => {
    try {
      return JSON.parse(feed as string);
    } catch {
      return null;
    }
  }, [feed]);
  const [imageFailed, setImageFailed] = React.useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

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
    });
  };
  return (
    <>
      <SafeAreaView
        className="flex-1 bg-white"
        edges={["top", "left", "right"]}
      >
        <View className="flex-1 bg-white">
          <AppBar
            title={`${feedDetails?.postedBy.firstName} ${feedDetails?.postedBy.lastName}`.trim()}
            action={[
              <>
                {feedDetails.result && (
                  <Text style={{ fontSize: 12, color: "gray" }}>
                    {feedDetails.result} {feedDetails.unit} in{" "}
                    {getPostYear(feedDetails.date)}
                  </Text>
                )}
              </>,
            ]}
            showProfilePic
            profilePicUrl={feedDetails?.postedBy.profileUri ?? undefined}
          />
          <View className="flex-1 bg-[#F1F1F3]">
            <KeyboardAwareScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 10,
                paddingBottom: 140,
              }}
              enableOnAndroid={true}
              extraScrollHeight={20}
              showsVerticalScrollIndicator={false}
            >
              <View className="py-4 gap-4">
                {/* Post Image */}
                <TouchableOpacity
                  onPress={() => setShowImageModal(true)}
                  activeOpacity={0.9}
                >
                  <Image
                    source={
                      imageFailed || !feedDetails.postImageUri
                        ? AppImages.imageError
                        : { uri: feedDetails.postImageUri }
                    }
                    placeholder={AppImages.imageLoading}
                    contentFit="cover"
                    transition={500}
                    className="w-full"
                    alt="Event cover"
                    style={{ width: "100%", height: 274, borderRadius: 4 }}
                    onError={() => {
                      console.warn(
                        "Image failed to load:",
                        feedDetails.postImageUri
                      );
                      setImageFailed(true);
                    }}
                  />
                </TouchableOpacity>

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
                        source={
                          imageFailed || !feedDetails.postImageUri
                            ? AppImages.imageError
                            : { uri: feedDetails.postImageUri }
                        }
                        contentFit="contain"
                        style={{ width: width, height: height }}
                      />
                    </Animated.View>
                  </Animated.View>
                </Modal>

                {/* Actions */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <LikeComponent
                      feedId={feedDetails._id ?? feedDetails.id}
                      isLiked={feedDetails.isLiked}
                      validate={validate as string}
                    />

                    <DeleteOrFlagComponent
                      isOwner={feedDetails.isOwner}
                      feedId={feedDetails._id ?? feedDetails.id}
                      validate={validate as string}
                    />
                  </View>
                  <Text style={{ fontWeight: "600", fontSize: 14 }}>
                    {feedDetails.likesCount} likes
                  </Text>
                </View>
                {/* Caption */}
                <Text style={{ fontSize: 12, fontWeight: "500" }}>
                  {feedDetails.caption}
                </Text>
                <Box>
                  <Text style={{ fontSize: 12, color: "gray" }}>
                    {timeAgo(feedDetails.createdAt)}
                  </Text>
                </Box>
              </View>
            </KeyboardAwareScrollView>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};
export default FeedDetails;
