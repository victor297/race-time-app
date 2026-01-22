import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, Text } from "react-native";
import { FeedsCard } from "~/src/components";
import { useFetch } from "~/src/hooks";
import { Constants } from "~/src/utils";
import { FeedListDto, FeedResponse } from "~/src/types";

export default function FeedScreen() {
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    limit: 10,
  });
  const [feeds, setFeeds] = useState<FeedListDto>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // 🧠 Debounced search handler
  const handleSearch = useCallback(
    debounce((text: string) => {
      setFilters({ search: text, page: 1, limit: 10 });
      setFeeds([]);
      setHasMore(true);
    }, 600),
    []
  );
  const { data, isLoading, error, refetch } = useFetch<FeedResponse>(
    ["feeds_all"],
    "v2/feeds",
    {
      params: filters,
    }
  );
  // 🧩 Extract results and merge pages
  useEffect(() => {
    if (data?.data) {
      const newFeeds = data.data.data || [];
      if (filters.page === 1) {
        setFeeds(newFeeds);
      } else {
        setFeeds((prev) => {
          const existingIds = new Set(prev.map((e) => e._id));
          const merged = [
            ...prev,
            ...newFeeds.filter((e) => !existingIds.has(e._id)),
          ];
          return merged;
        });
      }

      // Determine if more pages exist
      const totalPages = data.data.pagination?.totalPages ?? 1;
      setHasMore(filters.page < totalPages);
    }
  }, [data]);
  // 🔽 Load next page on scroll
  const loadMore = () => {
    if (!isLoading && hasMore) {
      setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };
  // 🔁 Pull-to-refresh
  const onRefresh = async () => {
    setIsRefreshing(true);
    setFilters((prev) => ({ ...prev, page: 1 }));
    await refetch();
    setIsRefreshing(false);
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }} className="pb-24 pt-6">
      {/* 🔄 Conditional states */}
      {isLoading && feeds.length === 0 && Constants.config.production ? (
        <View style={{ marginTop: 8 }}>
          {/* Show 3 skeleton cards */}
          {[1, 2, 3].map((index) => (
            <FeedsCard key={`skeleton-${index}`} isLoading={true} />
          ))}
        </View>
      ) : isLoading && feeds.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FD2828B2" />
          <Text className="text-gray-500 mt-3">Loading feeds...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center mt-10">
          <Text className="text-red-500 text-center text-base">
            {error.message || "Failed to load events. Please try again."}
          </Text>
        </View>
      ) : (
        <FlatList
          className="flex-1 gap-8"
          data={feeds}
          keyExtractor={(item, index) => item._id ?? `feed-${index}`}
          renderItem={({ item, index }) => (
            <FeedsCard
              refresh={refetch}
              item={item}
              key={`feed-card-${index}`}
              isLoading={false}
            />
          )}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center mt-10 w-full">
              <Text className="text-gray-500 text-base">
                No feeds available at the moment.
              </Text>
            </View>
          )}
          ListFooterComponent={() =>
            isLoading && feeds.length > 0 ? (
              <View className="py-4 flex-1 w-full justify-center items-center">
                <ActivityIndicator size="small" color="#FD2828B2" />
                <Text className="text-gray-500 text-center mt-2 text-sm">
                  Loading more feeds...
                </Text>
              </View>
            ) : null
          }
          style={{ marginTop: 8 }}
        />
      )}
    </View>
  );
}
