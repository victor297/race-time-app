import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppBar } from "~/components";
import { Image } from "~/components/ui/image";
import { AppIcon, StatItem } from "~/src/components";
import stats from "~/src/data/mock/stats";
import { UserRacePositionDto } from "~/src/types";
import { formatDateToYMD } from "~/src/utils";

function PossitionDetailsScreen() {
  const { data } = useLocalSearchParams<{ data: string }>();
  const positionData: UserRacePositionDto = React.useMemo(() => {
    try {
      return JSON.parse(data as string);
    } catch {
      return null;
    }
  }, [data]);
  console.log("PossitionDetailsScreen data:", positionData);
  const EventCard = () => {
    return (
      <>
        <View className="flex-row justify-start items-center gap-4">
          <View className="w-[64px] h-[64px] rounded-full overflow-hidden bg-gray-100 items-center justify-center">
            {positionData.event.imageUrl ? (
              <Image
                source={{ uri: positionData.event.imageUrl ?? "" }}
                resizeMode="cover"
                className="w-full h-full"
              />
            ) : (
              <View className="w-[64px] h-[64px] rounded-full bg-blue-500 items-center justify-center">
                <Feather name="award" size={40} color="white" />
              </View>
            )}
          </View>
          <View className="flex-1 flex-col justify-between items-stretch gap-1">
            <Text
              numberOfLines={2}
              className="text-xs font-semibold text-black"
            >
              {positionData.event.title}
            </Text>
            <Text
              numberOfLines={1}
              className="text-10px font-medium text-black/50"
            >
              {positionData.event.eventLocation}
            </Text>
            <Text className="text-10px font-medium text-black/50">
              {formatDateToYMD(positionData.event.eventDate)}{" "}
              {positionData.event.eventEndDate && (
                <> - {formatDateToYMD(positionData.event.eventEndDate)}</>
              )}
            </Text>
          </View>
        </View>
      </>
    );
  };
  const completedKm = positionData.stats.distanceKm.toFixed(2);
  const DetailsRow = ({ label, value }: { label: string; value: string }) => (
    <View className="flex-row justify-between">
      <Text className="text-10px text-black/50 font-medium">{label}</Text>
      <Text className="text-10px font-medium text-black/75">{value}</Text>
    </View>
  );
  return (
    <>
      <SafeAreaView
        className="flex-1 bg-white"
        edges={["top", "left", "right"]}
      >
        <View className="flex-1 bg-white">
          <AppBar title={positionData.event.title ?? ""} />
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
                <View className="bg-white rounded-2xl p-5 shadow-none gap-4 flex-col">
                  <EventCard />
                  <View className="h-px bg-gray-200" />
                  {/* Stats Row */}
                  <View className="flex-row justify-between px-0">
                    <StatItem
                      value={`${completedKm} KM`}
                      label="Distance(km)"
                      iconBgColor={
                        positionData.stats.distanceKm > 0
                          ? "#4A90E2"
                          : "#C8D1E1"
                      }
                      icon={
                        <AppIcon
                          name="distance"
                          type="svg"
                          size={24}
                          color="white"
                        />
                      }
                    />
                    <StatItem
                      value={`${positionData.stats.pace.toFixed(2)} KM`}
                      label="Pace"
                      iconBgColor={
                        positionData.stats.pace > 0 ? "#00D68F" : "#C8D1E1"
                      }
                      icon={
                        <MaterialCommunityIcons
                          name="speedometer"
                          size={24}
                          color="white"
                        />
                      }
                    />
                    <StatItem
                      value={positionData.stats.noOfRuns}
                      label="No. of Runs"
                      iconBgColor={
                        positionData.stats.noOfRuns > 0 ? "#FF6B9D" : "#C8D1E1"
                      }
                      icon={
                        <AppIcon
                          name="running"
                          type="FontAwesome5"
                          size={24}
                          color="white"
                        />
                      }
                    />
                  </View>
                  {/* Divider */}
                  <View className="h-px bg-gray-200 mb-4" />
                  {/* Position Details */}
                  <View className="flex-col gap-3">
                    <DetailsRow
                      label="Bib Number"
                      value={positionData.user.bibNumber}
                    />
                    <DetailsRow
                      label="Time"
                      value={positionData.positions.completionTime}
                    />
                    <DetailsRow label="Distsnace (KM)" value={completedKm} />
                    <DetailsRow
                      label="Space"
                      value={`${positionData.stats.pace ?? 0}`}
                    />
                  </View>
                </View>
              </View>
            </KeyboardAwareScrollView>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

export default PossitionDetailsScreen;
