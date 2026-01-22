import { useState, useEffect } from "react";
import { ScrollView, Text, View, ActivityIndicator } from "react-native";
import { ActivityCard } from "~/src/components";
import { useFetch } from "~/src/hooks";
import { ActivityResponse } from "~/src/types";
import { Skeleton } from "moti/skeleton";

function ActivityScreen() {
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    limit: 10,
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { data, isLoading, error, refetch } = useFetch<ActivityResponse>(
    ["activities_all", String(filters.page)],
    `v2/activities?page=${filters.page}&limit=${filters.limit}`
  );

  useEffect(() => {
    if (data?.data?.data) {
      if (filters.page === 1) {
        setActivities(data.data.data);
      } else {
        setActivities((prev) => [...prev, ...data.data.data]);
      }
      setHasMore(data.data.data.length >= filters.limit);
      setLoadingMore(false);
    }
  }, [data]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !isLoading) {
      setLoadingMore(true);
      setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    if (isCloseToBottom) {
      handleLoadMore();
    }
  };

  return (
    <View
      className="flex-1 bg-[#F1F1F3]"
      style={{ paddingHorizontal: 8, paddingVertical: 20 }}
    >
      <View
        className="bg-white rounded-2xl p-5 shadow-none"
        style={{ maxHeight: "90%" }}
      >
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          Activities
        </Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={400}
        >
          {isLoading && filters.page === 1 ? (
            // Initial loading skeletons
            <>
              {Array.from({ length: 5 }).map((_, index) => (
                <View
                  key={`skeleton-${index}`}
                  className="py-4 border-b border-gray-100"
                >
                  <View className="flex-row items-center">
                    <Skeleton
                      colorMode="light"
                      width={48}
                      height={48}
                      radius={24}
                    />
                    <View className="ml-3 flex-1">
                      <Skeleton
                        colorMode="light"
                        width={150}
                        height={16}
                        radius={4}
                      />
                      <View className="mt-2">
                        <Skeleton
                          colorMode="light"
                          width={200}
                          height={14}
                          radius={4}
                        />
                      </View>
                      <View className="mt-1">
                        <Skeleton
                          colorMode="light"
                          width={100}
                          height={12}
                          radius={4}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </>
          ) : (
            <>
              {activities?.map((act, i) => (
                <View
                  key={act._id}
                  className={`${
                    i < activities.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <ActivityCard activity={act} onPress={() => {}} />
                </View>
              ))}

              {/* Load More Indicator */}
              {loadingMore && hasMore && (
                <View className="py-4 items-center">
                  <ActivityIndicator size="small" color="#EF4444" />
                </View>
              )}

              {/* No More Data */}
              {!hasMore && activities.length > 0 && (
                <View className="py-4 items-center">
                  <Text className="text-sm text-gray-400">
                    No more activities
                  </Text>
                </View>
              )}

              {/* Empty State */}
              {!isLoading && activities.length === 0 && (
                <View className="py-10 items-center">
                  <Text className="text-gray-500">No activities found</Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

export default ActivityScreen;
