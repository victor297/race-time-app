import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "~/components/ui/avatar";
import { Spinner } from "~/components/ui/spinner";
import { formatNumber } from "~/src/utils";
import { AnimatedView } from "../ui";
import { Skeleton } from "moti/skeleton"; // ✅ correct import
import { UserProfileDto } from "~/src/types";
import { useCreate, useDelete } from "~/src/hooks";

interface ProfileCardProps {
  data?: UserProfileDto;
  onEdit?: () => void;
  showEditButton?: boolean;
  isLoading: boolean;
  validate: string[];
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  data,
  onEdit,
  isLoading,
  showEditButton,
  validate,
}) => {
  // ✅ Safe defaults when data is undefined
  const profile = data?.profile ?? {
    id: "",
    fullname: "",
    profileUri: "",
    bio: "",
  };

  const stats = data?.stats ?? {
    followers: 0,
    following: 0,
    posts: 0,
    isFollowing: false,
    canFollow: false,
    hasStarred: false,
    canStar: false,
  };

  const { bio, fullname, profileUri } = profile;
  const { canFollow, followers, following, posts, isFollowing } = stats;
  const { mutate, isPending } = useCreate<any>(
    `v2/profile/follow/${profile.id}`,
    [
      ["feeds_all"],
      [`my_post_photos_${profile.id}`],
      validate.length > 0 ? validate : "",
    ]
  );
  const { mutate: mutate2, isPending: isPending2 } = useDelete<any>(
    `v2/profile/follow/${profile.id}`,
    [
      ["feeds_all"],
      [`my_post_photos_${profile.id}`],
      validate.length > 0 ? validate : "",
    ]
  );
  const onFollow = () => {
    try {
      mutate({});
    } catch (err: any) {
      console.error("Error following user:", err.message);
    }
  };
  const onUnFollow = () => {
    try {
      mutate2({});
    } catch (err: any) {
      console.error("Error following user:", err.message);
    }
  };
  return (
    <View className="bg-white rounded-[12px] shadow-none p-[20px]">
      <View className="flex-row items-start gap-6">
        <AnimatedView variant="fade">
          {isLoading ? (
            <Skeleton
              colorMode="light"
              width={112}
              height={112}
              radius="round"
            />
          ) : (
            <Avatar className="w-28 h-28 rounded-full">
              {profileUri && <AvatarImage source={{ uri: profileUri }} />}
              {!profileUri && (
                <AvatarFallbackText className="text-white text-4xl">
                  {fullname}
                </AvatarFallbackText>
              )}
            </Avatar>
          )}
        </AnimatedView>

        <View className="flex-1">
          <View className="flex-col items-start flex-1">
            <AnimatedView variant="scaleX" direction="left">
              {isLoading ? (
                <View style={{ marginBottom: 6 }}>
                  <Skeleton
                    colorMode="light"
                    width={120}
                    height={16}
                    radius="round"
                  />
                </View>
              ) : (
                <Text className="text-14px font-bold text-black mb-2">
                  {fullname}
                </Text>
              )}
            </AnimatedView>

            <View className="flex-row mb-2 justify-between w-full">
              {[followers, following, posts].map((value, i) => (
                <AnimatedView key={i} className="items-center" variant="scale">
                  {isLoading ? (
                    <>
                      <Skeleton
                        colorMode="light"
                        width={40}
                        height={14}
                        radius="round"
                      />
                      <AnimatedView className="mt-1">
                        <Skeleton
                          colorMode="light"
                          width={60}
                          height={10}
                          radius="round"
                        />
                      </AnimatedView>
                    </>
                  ) : (
                    <>
                      <Text className="text-lg font-bold">
                        {formatNumber(value)}
                      </Text>
                      <Text className="text-gray-400 text-sm">
                        {["followers", "following", "Posts"][i]}
                      </Text>
                    </>
                  )}
                </AnimatedView>
              ))}
            </View>

            {!isLoading && (
              <>
                {(canFollow || isFollowing) && (
                  <TouchableOpacity
                    onPress={
                      isPending
                        ? undefined
                        : isFollowing
                          ? onUnFollow
                          : onFollow
                    }
                    activeOpacity={0.8}
                    className={`${isPending ? "bg-primary-200" : "bg-primary-500"} px-4 py-2 rounded-xl flex-row items-center w-full justify-center gap-2`}
                    accessibilityRole="button"
                    accessibilityLabel="Follow user"
                  >
                    {!isPending && (
                      <Text className="text-sm font-medium text-white">
                        {isFollowing ? "Unfollow" : "Follow"}
                      </Text>
                    )}
                    {(isPending || isPending2) && (
                      <Spinner size="small" color="#ffffff" />
                    )}
                  </TouchableOpacity>
                )}
                {!canFollow && showEditButton && (
                  <TouchableOpacity
                    onPress={onEdit}
                    activeOpacity={0.8}
                    className="bg-gray-100 px-4 py-2 rounded-xl flex-row items-center w-full justify-center gap-2"
                    accessibilityRole="button"
                    accessibilityLabel="Edit profile"
                  >
                    <Text className="text-sm font-medium">Edit Profile</Text>
                    <MaterialCommunityIcons
                      name="account-edit-outline"
                      size={16}
                    />
                  </TouchableOpacity>
                )}
              </>
            )}
            {isLoading && (
              <Skeleton
                colorMode="light"
                width={"100%"}
                height={32}
                radius="round"
              />
            )}
          </View>
        </View>
      </View>

      <View className="h-px bg-gray-200 mt-10 mb-8" />

      <AnimatedView variant="fade" className="mb-2">
        {isLoading ? (
          <Skeleton colorMode="light" width={100} height={14} radius="round" />
        ) : (
          <Text className="font-[700] text-14px">{fullname}</Text>
        )}
      </AnimatedView>

      <AnimatedView variant="fade">
        {isLoading ? (
          <>
            <Skeleton
              colorMode="light"
              width={"100%"}
              height={10}
              radius="round"
            />
            <Skeleton
              colorMode="light"
              width={"80%"}
              height={10}
              radius="round"
              // style={{ marginTop: 6 }}
            />
          </>
        ) : (
          <Text className="text-black/50 leading-6 text-12px">{bio} </Text>
        )}
      </AnimatedView>
    </View>
  );
};

export default ProfileCard;
