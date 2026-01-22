import React, { useState, useEffect, useCallback } from "react";
import { FlatList, Text, View, ActivityIndicator } from "react-native";
import { AppSearch, EventCard } from "~/src/components";
import { useFetch } from "~/src/hooks";
import { Constants } from "~/src/utils";
import { EventDto, EventResponse } from "~/src/types";
import debounce from "lodash.debounce";

function AllEvents() {
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    limit: 10,
  });

  const [events, setEvents] = useState<EventDto[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 🧠 Debounced search handler
  const handleSearch = useCallback(
    debounce((text: string) => {
      setFilters({ search: text, page: 1, limit: 10 });
      setEvents([]);
      setHasMore(true);
    }, 600),
    []
  );

  const { data, isLoading, error, refetch } = useFetch<EventResponse>(
    ["events_all"],
    "v2/events",
    {
      params: filters,
    }
  );

  // 🧩 Extract results and merge pages
  useEffect(() => {
    if (data?.data) {
      const newEvents = data.data.data || [];
      if (filters.page === 1) {
        setEvents(newEvents);
      } else {
        setEvents((prev) => {
          const existingIds = new Set(prev.map((e) => e.id));
          const merged = [
            ...prev,
            ...newEvents.filter((e) => !existingIds.has(e.id)),
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
    <View className="flex-1 bg-[#f9fafb] px-6 pt-4 pb-24">
      {/* ✅ Always visible search bar */}
      <AppSearch onSearchText={handleSearch} placeholder="Search events..." />

      {/* 🔄 Conditional states */}
      {isLoading && events.length === 0 && Constants.config.production ? (
        <View style={{ marginTop: 8 }}>
          {/* Show 3 skeleton cards */}
          {[1, 2, 3].map((index) => (
            <EventCard key={`skeleton-${index}`} isLoading={true} />
          ))}
        </View>
      ) : isLoading && events.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FD2828B2" />
          <Text className="text-gray-500 mt-3">Loading events...</Text>
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
          data={events}
          keyExtractor={(item, index) => item.id ?? `event-${index}`}
          renderItem={({ item }) => (
            <EventCard
              key={item.id ?? `event-card-${item.id}`}
              event={item}
              isLoading={false}
              refresh={refetch}
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
                No events available at the moment.
              </Text>
            </View>
          )}
          ListFooterComponent={() =>
            isLoading && events.length > 0 ? (
              <View className="py-4 flex-1 w-full justify-center items-center">
                <ActivityIndicator size="small" color="#FD2828B2" />
                <Text className="text-gray-500 text-center mt-2 text-sm">
                  Loading more events...
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

export default AllEvents;
