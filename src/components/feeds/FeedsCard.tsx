import { Entypo, Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Dimensions,
  Animated,
} from "react-native";
import Toast from "react-native-toast-message";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "~/components/ui/avatar";
import { Box } from "~/components/ui/box";
import { Button } from "~/components/ui/button";
import AppImages from "~/src/configs/AppImages";
import { useLoading } from "~/src/context";
import { useCreate, useDelete } from "~/src/hooks";
import { FeedDto } from "~/src/types";
import { getInitials, getPostYear, timeAgo, Constants } from "~/src/utils";
import { Skeleton } from "moti/skeleton";

const { width, height } = Dimensions.get("window");

// Skeleton Component for FeedsCard
const FeedsCardSkeleton = () => {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: "#eee",
      }}
    >
      <Skeleton.Group show={true}>
        {/* User Row Skeleton */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Skeleton colorMode="light" width={40} height={40} radius={20} />
            <View style={{ marginLeft: 10 }}>
              <Skeleton colorMode="light" width={120} height={14} radius={4} />
            </View>
          </View>
          <Skeleton colorMode="light" width={80} height={12} radius={4} />
        </View>

        {/* Post Image Skeleton */}
        <Skeleton colorMode="light" width="100%" height={274} radius={4} />
        {/* Actions Skeleton */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 6,
            marginTop: 8,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <Skeleton colorMode="light" width={24} height={24} radius={12} />
            <Skeleton colorMode="light" width={24} height={24} radius={12} />
          </View>
          <Skeleton colorMode="light" width={60} height={14} radius={4} />
        </View>

        {/* Caption Skeleton */}
        <Skeleton colorMode="light" width="100%" height={12} radius={4} />
        <View style={{ marginTop: 8 }}>
          <Skeleton colorMode="light" width={100} height={12} radius={4} />
        </View>
      </Skeleton.Group>
    </View>
  );
};

interface FeedsCardProps {
  item?: FeedDto;
  refresh?: () => void;
  isLoading?: boolean;
}
function FeedsCard({ item, refresh, isLoading }: FeedsCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
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

  if ((isLoading || !item) && Constants.config.production) {
    return <FeedsCardSkeleton />;
  }

  if (!item) {
    return null;
  }
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: "#eee",
        width: "100%",
        flex: 1,
        marginBottom: 20,
      }}
    >
      {/* User Row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
          flex: 1,
          width: "100%",
        }}
      >
        <View className="flex-1 flex-row">
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/user-profile",
                params: { feed: JSON.stringify(item) },
              })
            }
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Avatar
                style={{
                  marginRight: 10,
                }}
              >
                {item.postedBy.profileUri && (
                  <AvatarImage
                    source={{
                      uri: item.postedBy.profileUri ?? undefined,
                    }}
                  />
                )}
                {!item.postedBy.profileUri && (
                  <Text className="text-white">
                    {getInitials(
                      `${item.postedBy.firstName} ${item.postedBy.lastName}`
                    )}
                  </Text>
                )}
              </Avatar>
              <View>
                <Text style={{ fontWeight: "400", fontSize: 14 }}>
                  {item.postedBy.firstName} {item.postedBy.lastName}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View className="flex flex-row justify-end w-[120px]">
          {item.result && (
            <Text style={{ fontSize: 12, color: "gray" }} className="w-[100%] text-right">
              {item.result} {item.unit || "KM"} in {getPostYear(item.date)}
            </Text>
          )}
        </View>
      </View>

      {/* Post Image */}
      <TouchableOpacity
        onPress={() => setShowImageModal(true)}
        activeOpacity={0.9}
      >
        <Image
          source={
            imageFailed || !item.postImageUri
              ? AppImages.imageError
              : { uri: item.postImageUri }
          }
          placeholder={AppImages.imageLoading}
          contentFit="cover"
          transition={500}
          className="w-full h-[274px]"
          alt="Event cover"
          style={{ width: "100%", height: 274, borderRadius: 4 }}
          onError={() => {
            console.warn("Image failed to load:", item.postImageUri);
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
                imageFailed || !item.postImageUri
                  ? AppImages.imageError
                  : { uri: item.postImageUri }
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
          marginBottom: 6,
          marginTop: 8,
          width: "100%",
        }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", gap: 16 }}
          className="flex-1"
        >
          <LikeComponent
            refresh={refresh}
            feedId={item._id ?? item.id}
            isLiked={item.isLiked}
          />
          <DeleteOrFlagComponent
            isOwner={item.isOwner}
            feedId={item._id ?? item.id}
          />
        </View>
        <View className="flex flex-row justify-end">
          <Text style={{ fontWeight: "600", fontSize: 14 }}>
            {item.likesCount} likes
          </Text>
        </View>
      </View>

      {/* Caption */}
      <View className="flex-1 flex-col">
        <Text style={{ fontSize: 12, marginBottom: 8, fontWeight: "500" }}>
          {item.caption}
        </Text>
      </View>
      <Box className="w-full mt-2 flex flex-1 flex-row">
        <Text style={{ fontSize: 12, color: "gray" }} className="w-full">
          {timeAgo(item.createdAt)}
        </Text>
      </Box>
    </View>
  );
}

export default FeedsCard;

export const LikeComponent = ({
  isLiked,
  feedId,
  refresh,
  validate,
}: {
  isLiked: boolean;
  feedId: string;
  refresh?: () => void;
  validate?: string;
}) => {
  const [like, setLike] = React.useState<boolean>(isLiked);
  const { mutate } = useCreate<any>(`v2/feeds/${feedId}/like`, [
    ["feeds_all"],
    ["my_post_photos"],
    validate ? [validate] : "",
  ]);
  const onClicked = () => {
    setLike(!like);
    try {
      mutate(
        {},
        {
          onSuccess(_, __, ___) {
            // refresh && refresh();
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

export const DeleteOrFlagComponent = ({
  isOwner,
  feedId,
  validate,
}: {
  isOwner: boolean;
  feedId: string;
  validate?: string;
}) => {
  const { mutate } = useDelete<any>(`v2/feeds/${feedId}`, [
    ["feeds_all"],
    ["my_post_photos"],
    validate ? [validate] : "",
  ]);
  const { showLoading, hideLoading } = useLoading();
  const onDelete = () => {
    Alert.alert(
      "Delete this post?",
      "Are you sure you want to delete this post?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Delete",
          onPress: () => {
            showLoading();
            mutate(
              {},
              {
                onSuccess(_, __, ___) {
                  Toast.show({
                    type: "success",
                    text2: "Post deleted successfully",
                    text1: "Deleted",
                  });
                  hideLoading();
                  router.back();
                },
                onError(error) {
                  hideLoading();
                  Toast.show({
                    type: "error",
                    text2: "Failed to delete post",
                    text1: "Error",
                  });
                  console.log("Error deleting post:", error);
                },
              }
            );
          },
        },
      ],
      { cancelable: true }
    );
  };
  return (
    <>
      {isOwner ? (
        <Button variant={"link"} onPress={onDelete}>
          <Feather name="delete" size={24} />
        </Button>
      ) : (
        <></>
      )}
    </>
  );
};
