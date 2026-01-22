import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppBar } from "~/components";
import { RaceCard } from "~/src/components";
import { useFetch } from "~/src/hooks";
import { useProfileStore } from "~/src/store";
import { UserJoinedRaceResponse } from "~/src/types";

const AllJoinedRaceScreen = () => {
  const { userId, name } = useLocalSearchParams<{
    userId: string;
    name: string;
  }>();
  const { data: joinedRaceData, isLoading: joinedRaceLoading } =
    useFetch<UserJoinedRaceResponse>(
      [`my_joined_races${userId ? `_${userId}` : ""}`],
      `v2/races/joined${userId ? `?userId=${userId}` : ""}`,
      {
        forceRefetch: true,
      }
    );
  const profile = useProfileStore((state) => state.data);
  return (
    <>
      <SafeAreaView
        className="flex-1 bg-white"
        edges={["top", "left", "right"]}
      >
        <View className="flex-1 bg-white">
          <AppBar title={`Joined Races`} />
          <View className="flex-1 bg-[#F1F1F3]">
            <KeyboardAwareScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingHorizontal: 8,
                paddingTop: 10,
                paddingBottom: 140,
              }}
              enableOnAndroid={true}
              extraScrollHeight={20}
              showsVerticalScrollIndicator={false}
            >
              <View className="py-4 gap-4">
                <RaceCard
                  title="All"
                  races={joinedRaceData?.data.data ?? []}
                  onPressRace={(r) => console.log("pressed")}
                  isLoading={joinedRaceLoading}
                  maxItems={
                    joinedRaceLoading
                      ? 4
                      : (joinedRaceData?.data.data ?? []).length
                  }
                  showDetailsButton={userId !== profile?._id ? false : true}
                  user={{
                    name: name,
                    userId: userId,
                  }}
                />
              </View>
            </KeyboardAwareScrollView>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};
export default AllJoinedRaceScreen;
