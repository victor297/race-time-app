import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text } from "react-native";
import { TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppBar } from "~/components";
import { Heading } from "~/components/ui/heading";
import { CircleIcon } from "~/components/ui/icon";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "~/components/ui/radio";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetFlatList,
  ActionsheetItem,
  ActionsheetItemText,
} from "~/components/ui/select/select-actionsheet";
import { VStack } from "~/components/ui/vstack";
import { StatsCard } from "~/src/components";
import ActivityListCard from "~/src/components/profile/ActivityListCard";
import { useFetch } from "~/src/hooks";
import {
  UserRaceActiviResponse,
  UserRaceStatsDto,
  UserRaceStatsResponse,
} from "~/src/types";

const ProfileStatsDetailsScreen = () => {
  const { stats, userId } = useLocalSearchParams<{
    stats: string;
    userId: string;
  }>();
  const [loading, setLoading] = React.useState<boolean>(true);
  const currentYear = new Date().getFullYear();
  const years = [];
  const [year, setYear] = React.useState<any>("");
  const details: UserRaceStatsDto = React.useMemo(() => {
    try {
      return JSON.parse(stats as string);
    } catch {
      return null;
    }
  }, [stats]);
  React.useEffect(() => {
    if (details && stats) {
      setLoading(false);
    }
  }, [stats, details]);
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const handleClose = () => setShowActionsheet(false);
  for (let y = currentYear; y >= 2023; y--) {
    years.push(y);
  }

  const { data: raceData, isLoading: raceLoading } =
    useFetch<UserRaceStatsResponse>(
      [`my_race_stats_details${userId ? `_${userId}` : ""}`, `${year}`],
      `v2/races/stats${userId ? `?userId=${userId}` : ""}${year ? `${userId ? "&" : "?"}year=${year}` : ""}`,
      { forceRefetch: true }
    );
  const { data: activityData, isLoading: activityLoading } =
    useFetch<UserRaceActiviResponse>(
      [`my_race_activity_details${userId ? `_${userId}` : ""}`, `${year}`],
      `v2/races/activities${userId ? `?userId=${userId}` : ""}${year ? `${userId ? "&" : "?"}year=${year}` : ""}`,
      { forceRefetch: true }
    );
  return (
    <>
      <SafeAreaView
        className="flex-1 bg-white"
        edges={["top", "left", "right"]}
      >
        <View className="flex-1 bg-white">
          <AppBar
            title="Personal Stats"
            action={[
              <TouchableOpacity
                onPress={() => setShowActionsheet(true)}
                className="flex w-[80px] flex-row gap-2 items-center bg-[#EDF1F3] px-3 py-2 rounded-xl"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <View className="w-[35px]">
                  <Text>{year ? year : "All "}</Text>
                </View>
                <Feather name="chevron-down" size={24} color="black" />
              </TouchableOpacity>,
            ]}
          />

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
                <StatsCard
                  title="Total Stats"
                  year={""}
                  stats={
                    raceData?.data.data ?? {
                      distanceKm: 0,
                      noOfRuns: 0,
                      pace: 0,
                    }
                  }
                  isLoading={raceLoading}
                />
                <ActivityListCard
                  status="verified"
                  isLoading={activityLoading}
                  items={activityData?.data.data ?? []}
                />
              </View>
            </KeyboardAwareScrollView>
          </View>
        </View>
      </SafeAreaView>
      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent className="bg-white">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator className="bg-gray-500" />
          </ActionsheetDragIndicatorWrapper>
          <VStack className="w-full p-4" space="xl">
            <Heading size="lg">Filter by year</Heading>
            <RadioGroup
              value={year}
              onChange={(value) => {
                setYear(value);
                handleClose();
              }}
              className="gap-4"
            >
              <Radio value={""} className="justify-between mb-2 w-full">
                <RadioLabel className="flex-1">All</RadioLabel>
                <RadioIndicator>
                  <RadioIcon as={CircleIcon} />
                </RadioIndicator>
              </Radio>
              <ActionsheetFlatList
                className="h-96 w-full"
                data={years}
                initialNumToRender={10}
                renderItem={({ item }) => (
                  <Radio
                    key={`item-${item}`}
                    value={String(item)}
                    className="justify-between mb-2 w-full"
                  >
                    <RadioLabel className="flex-1">{String(item)}</RadioLabel>
                    <RadioIndicator>
                      <RadioIcon as={CircleIcon} />
                    </RadioIndicator>
                  </Radio>
                )}
                keyExtractor={(item) => String(item)}
              />
            </RadioGroup>
          </VStack>
          <ActionsheetItem onPress={handleClose}>
            <ActionsheetItemText>Cancel</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};

export default ProfileStatsDetailsScreen;
