import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppBar } from "~/components";
import { AnimatedView, AppSearch } from "~/src/components";
import { useFetch } from "~/src/hooks";
import {
  RaceResultCategoryDto,
  RaceResultDto,
  RaceResultScoreboardResponse,
  ScoreBoardDto,
} from "~/src/types";
import Toast from "react-native-toast-message";
import { Skeleton } from "moti/skeleton";
import { Constants } from "~/src/utils";
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
import { Heading } from "~/components/ui/heading";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "~/components/ui/radio";
import { CircleIcon } from "~/components/ui/icon";

interface ResultRowProps {
  result: ScoreBoardDto;
  onView: () => void;
}

const ResultRow = ({ result, onView }: ResultRowProps) => (
  <AnimatedView variant="fade">
    <View className="flex-row items-center py-4 border-b border-gray-100">
      {/* Name Column */}
      <View className="flex-1 pr-2">
        <Text className="text-base font-semibold text-gray-900">
          {result.user.fullName}
        </Text>
        <Text className="text-sm text-gray-500 mt-0.5">
          {result.user.bibNumber}
        </Text>
        <Text className="text-sm text-gray-500">{result.user.gender}</Text>
      </View>

      {/* Time Column */}
      <View className="w-20 items-center">
        <Text className="text-sm font-medium text-gray-900">
          {result.time.completionTime}
        </Text>
      </View>

      {/* Rank Column */}
      <View className="w-16 items-center">
        <Text className="text-sm font-semibold text-gray-900">
          {result.rankings.overall}
          {result.rankings.overall === 1
            ? "st"
            : result.rankings.overall === 2
              ? "nd"
              : result.rankings.overall === 3
                ? "rd"
                : "th"}
        </Text>
      </View>

      {/* View Icon */}
      <TouchableOpacity
        onPress={onView}
        className="w-10 items-center justify-center"
        activeOpacity={0.7}
      >
        <Feather name="eye" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  </AnimatedView>
);

const SkeletonResultRow = () => (
  <View className="flex-row items-center py-4 border-b border-gray-100">
    {/* Name Column */}
    <View className="flex-1 pr-2">
      <Skeleton colorMode="light" width={150} height={16} radius={4} />
      <View className="mt-2">
        <Skeleton colorMode="light" width={80} height={12} radius={4} />
      </View>
      <View className="mt-1">
        <Skeleton colorMode="light" width={60} height={12} radius={4} />
      </View>
    </View>

    {/* Time Column */}
    <View className="w-20 items-center">
      <Skeleton colorMode="light" width={60} height={14} radius={4} />
    </View>

    {/* Rank Column */}
    <View className="w-16 items-center">
      <Skeleton colorMode="light" width={40} height={14} radius={4} />
    </View>

    {/* View Icon */}
    <View className="w-10 items-center justify-center">
      <Skeleton colorMode="light" width={20} height={20} radius={10} />
    </View>
  </View>
);

const RaceResultsScreen = () => {
  const { data } = useLocalSearchParams<{ data: string }>();
  const race: RaceResultDto = React.useMemo(() => {
    try {
      return JSON.parse(data as string);
    } catch {
      return null;
    }
  }, [data]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<RaceResultCategoryDto>();
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // Filter states
  const [selectedSortBy, setSelectedSortBy] = useState("overall");
  const [selectedSortOrder, setSelectedSortOrder] = useState("asc");
  const [selectedGender, setSelectedGender] = useState("");

  // Build query params from selected filters
  const queryParams = React.useMemo(() => {
    const params = new URLSearchParams();
    if (selectedCategoryId)
      params.append("category", String(selectedCategoryId));
    if (selectedGender) params.append("gender", String(selectedGender));
    if (selectedSortBy) params.append("sort", String(selectedSortBy));
    if (selectedSortOrder)
      params.append("sortOrder", String(selectedSortOrder));
    const qs = params.toString();
    return qs ? `?${qs}` : "";
  }, [selectedCategoryId, selectedGender, selectedSortBy, selectedSortOrder]);

  const endpoint = `v2/races/leaderboard/${race.event.id}${queryParams}`;

  const { data: result, isLoading } = useFetch<RaceResultScoreboardResponse>(
    [
      `my_races_results_scoreboard`,
      race.event.id,
      selectedCategoryId,
      selectedGender,
      selectedSortBy,
      selectedSortOrder,
    ],
    endpoint,
    {
      forceRefetch: true,
    }
  );
  const filteredResults =
    result?.data.data.scoreboard?.filter((result) =>
      result.user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handleViewResult = (x: ScoreBoardDto) => {
    router.push({
      pathname: "/athlete-result",
      params: { event: JSON.stringify(race), score: JSON.stringify(x) },
    });
  };
  const sortingBy = ["overall", "category", "gender", "time", "name"];
  const sortingOrders = ["asc", "desc"];
  const genderLists = ["Male", "Female", "Other"];

  const handleResetFilters = () => {
    setSelectedSortBy("overall");
    setSelectedSortOrder("asc");
    setSelectedGender("");
  };

  const handleApplyFilters = () => {
    setShowFilter(false);
  };

  return (
    <>
      <SafeAreaView
        className="flex-1 bg-white"
        edges={["top", "left", "right"]}
      >
        <View className="flex-1 bg-white">
          <AppBar title={race.event.title ?? ""} />

          <View className="flex-1 bg-[#F1F1F3]">
            {/* Search Bar */}
            <View className="py-4 px-2">
              <AppSearch
                onSearchText={setSearchQuery}
                placeholder="Search..."
              />
            </View>

            {/* Filter Controls */}
            <View className="flex-row gap-3 mb-4 px-[8px]">
              {/* Category Dropdown */}
              <TouchableOpacity
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex-1 bg-white rounded-2xl px-4 py-3 flex-row items-center justify-between shadow-none"
                activeOpacity={0.7}
              >
                <Text className="text-sm text-gray-700">
                  {" "}
                  {selectedCategoryId
                    ? selectedCategory?.title
                    : "Overall (All)"}
                </Text>
                <Feather name="chevron-down" size={20} color="#6B7280" />
              </TouchableOpacity>

              {/* Filter Button */}
              <TouchableOpacity
                onPress={() => setShowFilter(!showFilter)}
                className="bg-white rounded-2xl px-4 py-3 flex-row items-center shadow-none"
                activeOpacity={0.7}
              >
                <Text className="text-sm text-gray-700 mr-2">Filter</Text>
                <Feather name="sliders" size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Filter Label */}
            <Text className="text-sm text-gray-500 mb-3 mx-2">
              Filtered By{" "}
              {selectedCategoryId ? selectedCategory?.title : "Overall (All)"}
            </Text>

            {/* Results Table */}
            <View className="bg-white rounded-2xl p-5 mx-2">
              {/* Table Header */}
              <View className="flex-row items-center pb-3 border-b-2 border-gray-200">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-700">
                    Name
                  </Text>
                </View>
                <View className="w-20 items-center">
                  <Text className="text-sm font-semibold text-gray-700">
                    Time
                  </Text>
                </View>
                <View className="w-16 items-center">
                  <Text className="text-sm font-semibold text-gray-700">
                    Rank
                  </Text>
                </View>
                <View className="w-10" />
              </View>

              {/* Results List */}
              {isLoading && Constants.config.production ? (
                <View>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <SkeletonResultRow key={`skeleton-${index}`} />
                  ))}
                </View>
              ) : isLoading ? (
                <View className="flex-1 justify-center items-center mt-10">
                  <ActivityIndicator size="large" color="#FD2828B2" />
                  <Text className="text-gray-500 mt-3">Loading results...</Text>
                </View>
              ) : (
                <FlatList
                  data={filteredResults}
                  keyExtractor={(item) => item.user.id}
                  renderItem={({ item }) => (
                    <ResultRow
                      result={item}
                      onView={() => handleViewResult(item)}
                    />
                  )}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={
                    <View className="items-center justify-center py-10">
                      <Text className="text-gray-500 text-center">
                        No results found
                      </Text>
                    </View>
                  }
                />
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
      <Actionsheet
        isOpen={showCategoryDropdown}
        onClose={() => setShowCategoryDropdown(false)}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent className="bg-white">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator className="bg-gray-500" />
          </ActionsheetDragIndicatorWrapper>
          <VStack className="w-full p-4" space="xl">
            <Heading size="lg">Filter by category</Heading>
            <RadioGroup
              value={selectedCategoryId}
              onChange={(value) => {
                setSelectedCategoryId(value);
                setSelectedCategory(
                  race.event?.categories.find(
                    (category) => String(category.id) === value
                  )
                );
                setShowCategoryDropdown(false);
              }}
              className="gap-4"
            >
              <Radio value={""} className="justify-between mb-2" size="lg">
                <RadioLabel>All</RadioLabel>
                <RadioIndicator>
                  <RadioIcon as={CircleIcon} />
                </RadioIndicator>
              </Radio>
              <FlatList<RaceResultCategoryDto>
                className="h-96"
                data={race.event?.categories ?? []}
                initialNumToRender={10}
                renderItem={({ item, index }) => (
                  <Radio
                    key={`item-${item.id}`}
                    value={String(item.id)}
                    className="justify-between mb-2"
                    size="lg"
                  >
                    <RadioLabel>{String(item.title)}</RadioLabel>
                    <RadioIndicator>
                      <RadioIcon as={CircleIcon} />
                    </RadioIndicator>
                  </Radio>
                )}
                keyExtractor={(item) => String(item.id)}
              />
            </RadioGroup>
          </VStack>
          <ActionsheetItem onPress={() => setShowCategoryDropdown(false)}>
            <ActionsheetItemText>Cancel</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
      <Actionsheet
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
        snapPoints={[65, 80]}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent className="bg-white">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator className="bg-gray-300" />
          </ActionsheetDragIndicatorWrapper>

          <VStack className="w-full px-6 pb-6">
            {/* Header with Reset */}
            <View className="flex-row justify-between items-center mb-6 mt-4">
              <TouchableOpacity
                onPress={handleResetFilters}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <Text className="text-red-500 font-medium text-base">
                  Reset
                </Text>
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-gray-900">
                Filters
              </Text>
              <View className="w-12" />
            </View>

            {/* Sort By Section */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-900 mb-4">
                Sort by
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {sortingBy.map((sort) => (
                  <TouchableOpacity
                    key={sort}
                    onPress={() => setSelectedSortBy(sort)}
                    className={`px-5 py-3 rounded-full ${
                      selectedSortBy === sort ? "bg-primary-500" : "bg-gray-100"
                    }`}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center gap-2">
                      <Text
                        className={`text-sm font-medium capitalize ${
                          selectedSortBy === sort
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {sort}
                      </Text>
                      {selectedSortBy === sort && (
                        <Feather name="check" size={16} color="white" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sort Order Section */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-900 mb-4">
                Order
              </Text>
              <View className="flex-row gap-2">
                {sortingOrders.map((order) => (
                  <TouchableOpacity
                    key={order}
                    onPress={() => setSelectedSortOrder(order)}
                    className={`px-5 py-3 rounded-full ${
                      selectedSortOrder === order
                        ? "bg-primary-500"
                        : "bg-gray-100"
                    }`}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center gap-2">
                      <Text
                        className={`text-sm font-medium capitalize ${
                          selectedSortOrder === order
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {order === "asc" ? "Ascending" : "Descending"}
                      </Text>
                      {selectedSortOrder === order && (
                        <Feather name="check" size={16} color="white" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Gender Filter Section */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-900 mb-4">
                Gender
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {genderLists.map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    onPress={() =>
                      setSelectedGender(selectedGender === gender ? "" : gender)
                    }
                    className={`px-5 py-3 rounded-full ${
                      selectedGender === gender
                        ? "bg-primary-500"
                        : "bg-gray-100"
                    }`}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center gap-2">
                      <Text
                        className={`text-sm font-medium capitalize ${
                          selectedGender === gender
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {gender}
                      </Text>
                      {selectedGender === gender && (
                        <Feather name="check" size={16} color="white" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Clear All Button */}
            <TouchableOpacity
              onPress={handleResetFilters}
              className="w-full py-4 mb-3 items-center justify-center border border-gray-300 rounded-xl"
              activeOpacity={0.7}
            >
              <Text className="text-base font-medium text-gray-900">
                Clear all
              </Text>
            </TouchableOpacity>

            {/* Apply Button */}
            <TouchableOpacity
              onPress={handleApplyFilters}
              className="w-full py-4 bg-primary-500 rounded-xl items-center justify-center"
              activeOpacity={0.8}
            >
              <Text className="text-base font-semibold text-white">
                Apply (
                {
                  [selectedSortBy, selectedSortOrder, selectedGender].filter(
                    (v) => v
                  ).length
                }
                )
              </Text>
            </TouchableOpacity>
          </VStack>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};

export default RaceResultsScreen;
