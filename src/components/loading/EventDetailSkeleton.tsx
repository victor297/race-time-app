import React from "react";
import { View, ScrollView, Dimensions } from "react-native";
import { Skeleton } from "moti/skeleton";

const { width } = Dimensions.get("window");

export default function EventDetailSkeleton() {
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* 🖼️ Banner */}
      <Skeleton
        colorMode="light"
        width={width}
        height={240}
        radius={0}
        backgroundColor="#e5e7eb"
      />

      {/* ⏱️ Countdown + Participants */}
      <View className="px-5 mt-6">
        <Skeleton width={180} height={20} radius={8} />
        <View className="flex-row mt-4">
          {[...Array(5)].map((_, i) => (
            <View key={i} style={{ marginRight: 10 }}>
              <Skeleton
                width={52}
                height={52}
                radius={52}
                colorMode="light"
                backgroundColor="#e5e7eb"
              />
            </View>
          ))}
        </View>
      </View>

      {/* 🧭 Tabs */}
      <View className="mt-6 px-5 flex-row justify-around">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} width={80} height={20} radius={6} />
        ))}
      </View>

      {/* 📄 Details Section */}
      <View className="px-5 mt-8">
        <Skeleton width={width * 0.6} height={26} radius={8} />
        <View style={{ marginTop: 8 }}>
          <Skeleton width={width * 0.4} height={16} radius={6} />
        </View>
        <View style={{ marginTop: 20 }}>
          <Skeleton width={width * 0.9} height={14} radius={6} />
        </View>
        <View style={{ marginTop: 10 }}>
          <Skeleton width={width * 0.85} height={14} radius={6} />
        </View>
        <View style={{ marginTop: 10 }}>
          <Skeleton width={width * 0.8} height={14} radius={6} />
        </View>
      </View>

      {/* 🏷️ Categories */}
      <View className="px-5 mt-10 flex-row flex-wrap">
        {[...Array(4)].map((_, i) => (
          <View key={i} style={{ marginRight: 10, marginBottom: 10 }}>
            <Skeleton width={90} height={34} radius={20} />
          </View>
        ))}
      </View>

      {/* 🖼️ Flyers */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-8 pl-5"
      >
        {[...Array(3)].map((_, i) => (
          <View key={i} style={{ marginRight: 12 }}>
            <Skeleton
              width={width * 0.9}
              height={180}
              radius={8}
              colorMode="light"
              backgroundColor="#e5e7eb"
            />
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}
