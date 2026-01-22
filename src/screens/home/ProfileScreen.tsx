import { router } from "expo-router";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  AchievementCard,
  PhotoCard,
  ProfileCard,
  RaceCard,
  RacePositionCard,
  StatsCard,
} from "~/src/components";
import { useTypedRouter } from "~/src/configs";
import { useFetch } from "~/src/hooks";
import {
  UserBadgesResponse,
  UserJoinedRaceResponse,
  UserPostPhotosResponse,
  UserProfileResponse,
  UserRacePositionResponse,
  UserRaceStatsResponse,
} from "~/src/types";

function ProfileScreen() {
  const { data, isLoading } = useFetch<UserProfileResponse>(
    ["user_profile_info-with-stats"],
    "v2/profile",
    { forceRefetch: true }
  );
  const year = new Date().getFullYear();
  const { data: raceData, isLoading: raceLoading } =
    useFetch<UserRaceStatsResponse>(
      [`my_race_stats`, `${year}`],
      `v2/races/stats?year=${year}`,
      { forceRefetch: true }
    );
  const { data: photoData, isLoading: photoLoading } =
    useFetch<UserPostPhotosResponse>([`my_post_photos`], `v2/feeds/user`, {
      forceRefetch: true,
    });
  const { data: joinedRaceData, isLoading: joinedRaceLoading } =
    useFetch<UserJoinedRaceResponse>([`my_joined_races`], `v2/races/joined`, {
      forceRefetch: true,
    });
  const { data: raceBadgesData, isLoading: raceBadgesLoading } =
    useFetch<UserBadgesResponse>([`my_race_badges`], `v2/races/badges`, {
      forceRefetch: true,
    });
  const { data: positionData, isLoading: positionLoading } =
    useFetch<UserRacePositionResponse>(
      [`my_race_positions`],
      `v2/races/positions`,
      {
        forceRefetch: true,
      }
    );
  const { push } = useTypedRouter();

  return (
    <View
      className="flex-1 bg-[#F1F1F3]"
      style={{ paddingHorizontal: 0, paddingVertical: 16 }}
    >
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 10 }}
        enableOnAndroid={true}
        extraScrollHeight={20}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 gap-[20px] pb-24">
          <ProfileCard
            isLoading={isLoading}
            data={data?.data.data}
            onEdit={() => {
              push({
                pathname: "/modal/edit-profile",
              } as any);
            }}
            showEditButton
            validate={[`my_race_stats`, `${year}`]}
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
                params: { stats: JSON.stringify(raceData?.data.data) },
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
                params: { feed: JSON.stringify(x) },
              });
            }}
            onViewAll={() => {
              router.push({
                pathname: "all-photos",
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
                  userId: data?.data.data.profile.id,
                  name: data?.data.data.profile.fullname,
                },
              });
            }}
            onPressRace={(r) => console.log("pressed")}
            isLoading={joinedRaceLoading}
            maxItems={3}
            user={{
              name: data?.data.data.profile.fullname ?? "",
              userId: data?.data.data.profile.id ?? "",
            }}
          />
          <AchievementCard
            headerTitle="Badges"
            showViewAll
            onViewAllPress={() => {
              router.push({
                pathname: "/all-badges",
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
              });
            }}
            items={positionData?.data.data ?? []}
            isLoading={positionLoading}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
export default ProfileScreen;
