import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppBar } from "~/components";
import { useFetch } from "~/src/hooks";
import { DigitalAssetDto, DigitalAssetResponse } from "~/src/types";
import { Skeleton } from "moti/skeleton";

function DigitalAssetScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  const SkeletonLoader = () => {
    return (
      <View className="bg-white flex-col gap-4 rounded-[12px] p-[20px] shadow-none mb-4">
        <Skeleton colorMode="light" width="100%" height={230} radius={8} />
        <View className="flex-row justify-between items-center">
          <View className="flex-col gap-2 flex-1">
            <Skeleton colorMode="light" width="60%" height={14} radius={4} />
            <Skeleton colorMode="light" width="80%" height={12} radius={4} />
          </View>
          <Skeleton colorMode="light" width={40} height={40} radius={8} />
        </View>
      </View>
    );
  };

  const EmptyState = () => {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <Feather name="image" size={64} color="#9CA3AF" />
        <Text className="text-gray-500 text-lg font-semibold mt-4">
          No Digital Assets
        </Text>
        <Text className="text-gray-400 text-sm mt-2 text-center px-8">
          There are no digital assets available for this event yet.
        </Text>
      </View>
    );
  };

  const RowData = ({ item }: { item: DigitalAssetDto }) => {
    return (
      <View className="bg-white flex-col gap-4 rounded-[12px] p-[20px] shadow-none mb-4">
        {item.asset.imageUri && (
          <Image
            source={{ uri: item.asset.imageUri }}
            style={{ width: "100%", height: 230, borderRadius: 8 }}
          />
        )}
        {!item.asset.imageUri && (
          <View className="w-full h-56 items-center justify-center bg-gray-200 rounded-lg">
            <Text className="text-gray-500">No Image Available</Text>
          </View>
        )}
        <View className="flex-row justify-between">
          <View className="flex-col gap-1">
            <Text className="text-xs font-bold text-black/75">
              {item.asset.name}
            </Text>
            <Text className="text-xs font-bold text-black/50">
              {item.asset.description}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              // Handle action button press
            }}
            className="px-4 py-2 bg-transparent rounded-xl"
          >
            <Feather name="download" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const { data: data, isLoading: loading } = useFetch<DigitalAssetResponse>(
    [`my_digital_assets_${eventId}`],
    `v2/assets/event/${eventId}`,
    {
      forceRefetch: true,
    }
  );
  return (
    <>
      <SafeAreaView
        className="flex-1 bg-white"
        edges={["top", "left", "right"]}
      >
        <View className="flex-1 bg-white">
          <AppBar title={`Digital Assets`} />
          <View className="flex-1 bg-[#F1F1F3]">
            <KeyboardAwareScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingTop: 20,
                paddingBottom: 140,
              }}
              enableOnAndroid={true}
              extraScrollHeight={20}
              showsVerticalScrollIndicator={false}
            >
              {loading && (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <SkeletonLoader key={i} />
                  ))}
                </>
              )}

              {!loading &&
                (!data?.data.data || data.data.data.length === 0) && (
                  <EmptyState />
                )}

              {!loading && data?.data.data && data.data.data.length > 0 && (
                <>
                  {data.data.data.map((item) => (
                    <RowData key={item.id} item={item} />
                  ))}
                </>
              )}
            </KeyboardAwareScrollView>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

export default DigitalAssetScreen;
