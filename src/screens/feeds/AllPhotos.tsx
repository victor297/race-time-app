import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
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
import { PhotoCard } from "~/src/components";
import { useFetch } from "~/src/hooks";
import { UserPostPhotosResponse } from "~/src/types";

const AllPhotosScreen = () => {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const currentYear = new Date().getFullYear();
  const years = [];
  const [year, setYear] = React.useState<any>("");
  const { data: photoData, isLoading: photoLoading } =
    useFetch<UserPostPhotosResponse>(
      [`my_post_photos${userId ? `_${userId}` : ""}${year ? `_${year}` : ""}`],
      `v2/feeds/user${userId ? `?userId=${userId}` : ""}${year ? `${userId ? "&" : "?"}year=${year}` : ""}`,
      {
        forceRefetch: true,
      }
    );
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const handleClose = () => setShowActionsheet(false);
  for (let y = currentYear; y >= 2023; y--) {
    years.push(y);
  }
  return (
    <>
      <SafeAreaView
        className="flex-1 bg-white"
        edges={["top", "left", "right"]}
      >
        <View className="flex-1 bg-white">
          <AppBar
            title={`All Photos`}
            action={[
              <TouchableOpacity
                onPress={() => setShowActionsheet(true)}
                className="flex w-[80px] flex-row gap-2 items-center bg-[#EDF1F3] px-3 py-2 rounded-xl"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <View className="w-[40px]">
                  <Text>{year ? year : "All"}</Text>
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
                <PhotoCard
                  title="All"
                  images={photoData?.data.data ?? []}
                  maxImages={
                    photoLoading ? 9 : (photoData?.data.data ?? []).length
                  }
                  onPressImage={(x) => {
                    router.push({
                      pathname: "/modal/feed-details",
                      params: {
                        feed: JSON.stringify(x),
                        validate: `my_post_photos${userId ? `_${userId}` : ""}${year ? `_${year}` : ""}`,
                      },
                    });
                  }}
                  isLoading={photoLoading}
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
            <ActionsheetDragIndicator />
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
                className="h-96"
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

export default AllPhotosScreen;
