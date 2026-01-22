import React, { useEffect, useState, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";
import dayjs from "dayjs";
import { Skeleton } from "moti/skeleton";

interface CountdownCardProps {
  eventDate: string; // e.g. "2025-12-31T23:59:59Z"
  isLoading?: boolean;
}

export default function CountdownCard({
  eventDate,
  isLoading = false,
}: CountdownCardProps) {
  const target = dayjs(eventDate);
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(target));
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const duration = 2500; // intro animation speed
    const start = Date.now();

    // Listen for animation progress safely
    const listenerId = animatedValue.addListener(({ value }) => {
      const simulated = getTimeRemaining(
        target.subtract((1 - value) * 365, "day")
      );
      setTimeLeft(simulated);
    });

    // Animate from 0 → 1
    Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start(() => {
      // Cleanup listener
      animatedValue.removeListener(listenerId);

      // Start normal countdown
      const interval = setInterval(() => {
        setTimeLeft(getTimeRemaining(target));
      }, 1000);

      return () => clearInterval(interval);
    });

    return () => animatedValue.removeListener(listenerId);
  }, [eventDate]);

  const data = [
    { num: timeLeft.days, label: "Days" },
    { num: timeLeft.hours, label: "Hours" },
    { num: timeLeft.minutes, label: "Minutes" },
    { num: timeLeft.seconds, label: "Seconds" },
  ];

  if (isLoading) {
    return (
      <View className="px-5 mt-6">
        <View className="bg-black rounded-2xl p-5">
          <View className="items-center mb-4">
            <Skeleton colorMode="dark" width={120} height={16} radius={4} />
          </View>

          <View className="flex-row justify-between mt-4">
            {[1, 2, 3, 4].map((i) => (
              <View key={i} className="items-center">
                <View className="bg-zinc-800 w-20 h-20 rounded-xl items-center justify-center">
                  <Skeleton
                    colorMode="dark"
                    width={40}
                    height={28}
                    radius={4}
                  />
                </View>
                <View className="mt-2">
                  <Skeleton
                    colorMode="dark"
                    width={50}
                    height={14}
                    radius={4}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="px-5 mt-6">
      <View className="bg-black rounded-2xl p-5">
        <Text className="text-center text-white font-semibold text-[14px]">
          Event Ends In
        </Text>

        <View className="flex-row justify-between mt-4">
          {data.map((d, i) => (
            <View key={i} className="items-center">
              <View className="bg-zinc-800 w-20 h-20 rounded-xl items-center justify-center">
                <Animated.Text className="text-white font-bold text-2xl">
                  {d.num.toString().padStart(2, "0")}
                </Animated.Text>
              </View>
              <Text className="text-gray-400 mt-2">{d.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function getTimeRemaining(target: dayjs.Dayjs) {
  const now = dayjs();
  const diff = target.diff(now, "second");
  const days = Math.floor(diff / (3600 * 24));
  const hours = Math.floor((diff % (3600 * 24)) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  return {
    days: Math.max(days, 0),
    hours: Math.max(hours, 0),
    minutes: Math.max(minutes, 0),
    seconds: Math.max(seconds, 0),
  };
}
