import { FontAwesome6 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppBar } from "~/components";
import {
  AchievementCard,
  PhotoCard,
  ProfileCard,
  RaceCard,
  RacePositionCard,
  StatsCard,
} from "~/src/components";
import { useFetch } from "~/src/hooks";
import {
  FeedDto,
  UserBadgesResponse,
  UserJoinedRaceResponse,
  UserPostPhotosResponse,
  UserProfileResponse,
  UserRacePositionResponse,
  UserRaceStatsResponse,
} from "~/src/types";

function UserProfileScreen() {
  const { feed } = useLocalSearchParams();
  console.log("feed details params", feed);
  const feedDetails: FeedDto = React.useMemo(() => {
    try {
      return JSON.parse(feed as string);
    } catch {
      return null;
    }
  }, [feed]);
  const { data, isLoading } = useFetch<UserProfileResponse>(
    [`user_profile_info-with-stats_${feedDetails?.postedBy?._id}`],
    `v2/profile?userId=${feedDetails?.postedBy?._id}`,
    { forceRefetch: true }
  );
  const year = new Date().getFullYear();
  const { data: raceData, isLoading: raceLoading } =
    useFetch<UserRaceStatsResponse>(
      [`my_race_stats_${feedDetails?.postedBy?._id}`, `${year}`],
      `v2/races/stats?userId=${feedDetails?.postedBy?._id}&year=${year}`,
      { forceRefetch: true }
    );
  const { data: photoData, isLoading: photoLoading } =
    useFetch<UserPostPhotosResponse>(
      [`my_post_photos_${feedDetails?.postedBy?._id}`],
      `v2/feeds/user?userId=${feedDetails?.postedBy?._id}`,
      {
        forceRefetch: true,
      }
    );
  const { data: joinedRaceData, isLoading: joinedRaceLoading } =
    useFetch<UserJoinedRaceResponse>(
      [`my_joined_races_${feedDetails?.postedBy?._id}`],
      `v2/races/joined?userId=${feedDetails?.postedBy?._id}`,
      {
        forceRefetch: true,
      }
    );
  const { data: raceBadgesData, isLoading: raceBadgesLoading } =
    useFetch<UserBadgesResponse>(
      [`my_race_badges_${feedDetails?.postedBy?._id}`],
      `v2/races/badges?userId=${feedDetails?.postedBy?._id}`,
      {
        forceRefetch: true,
      }
    );
  const { data: positionData, isLoading: positionLoading } =
    useFetch<UserRacePositionResponse>(
      [`my_race_positions_${feedDetails?.postedBy?._id}`],
      `v2/races/positions?userId=${feedDetails?.postedBy?._id}`,
      {
        forceRefetch: true,
      }
    );
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="flex-1 bg-white">
        <AppBar title={`Myracetime`} />
        <View className="flex-1 bg-[#F1F1F3]">
          <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingVertical: 20,
              paddingHorizontal: 8,
            }}
            enableOnAndroid={true}
            extraScrollHeight={20}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 gap-[20px] pb-24">
              <ProfileCard
                isLoading={isLoading}
                data={data?.data.data}
                validate={[
                  `user_profile_info-with-stats_${feedDetails?.postedBy?._id}`,
                ]}
              />
              <StatsCard
                title="Stats"
                year={year.toString()}
                stats={
                  raceData?.data.data ?? { distanceKm: 0, noOfRuns: 0, pace: 0 }
                }
                isLoading={raceLoading}
                onViewAll={() => {
                  router.push({
                    pathname: "/modal/stats-details",
                    params: {
                      stats: JSON.stringify(raceData?.data.data),
                      userId: feedDetails?.postedBy?._id,
                    },
                  });
                }}
              />
              <PhotoCard
                title="Posts"
                images={photoData?.data.data ?? []}
                maxImages={3}
                onPressImage={(x) => {
                  router.push({
                    pathname: "/modal/feed-details",
                    params: {
                      feed: JSON.stringify(x),
                      validate: `my_post_photos_${feedDetails?.postedBy?._id}`,
                    },
                  });
                }}
                onViewAll={() => {
                  router.push({
                    pathname: "all-photos",
                    params: {
                      userId: feedDetails?.postedBy?._id,
                    },
                  });
                }}
                isLoading={photoLoading}
              />
              <RaceCard
                title="Joined Races"
                races={joinedRaceData?.data.data ?? []}
                onViewAll={() => {
                  router.push({
                    pathname: "/all-joined-races",
                    params: {
                      userId: feedDetails?.postedBy?._id,
                    },
                  });
                }}
                onPressRace={(r) => console.log("pressed")}
                isLoading={joinedRaceLoading}
                maxItems={3}
                showDetailsButton={false}
                user={{
                  name: feedDetails?.postedBy?.firstName ?? "",
                  userId: feedDetails?.postedBy?._id ?? "",
                }}
              />
              <AchievementCard
                headerTitle="Badges"
                showViewAll
                onViewAllPress={() => {
                  router.push({
                    pathname: "/all-badges",
                    params: {
                      userId: feedDetails?.postedBy?._id,
                    },
                  });
                }}
                category="Barges"
                items={raceBadgesData?.data.data ?? []}
                isLoading={raceBadgesLoading}
              />
              <RacePositionCard
                headerTitle="Trophies"
                showViewAll
                onViewAllPress={() => {
                  router.push({
                    pathname: "/all-possitions",
                    params: {
                      userId: feedDetails?.postedBy?._id,
                    },
                  });
                }}
                items={positionData?.data.data ?? []}
                isLoading={positionLoading}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default UserProfileScreen;
