import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text, StatusBar } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Svg, Path } from "react-native-svg";
import { Box } from "~/components/ui/box";
import { HStack } from "~/components/ui/hstack";
import { AppBtn } from "~/src/components";
import { useTypedRouter } from "~/src/configs";
import { formatMoney } from "~/src/utils";
export default function PaymentSuccessScreen() {
  const { replace } = useTypedRouter();
  const { amount } = useLocalSearchParams<{
    amount: string;
  }>();
  const inset = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 bg-primary">
        <View className="flex-1 bg-white px-5" style={{ marginTop: inset.top }}>
          <StatusBar barStyle="light-content" backgroundColor="#ef4444" />
          {/* Spacer to roughly match vertical position in the reference image */}
          <View className="h-20" />

          {/* Green check circle */}
          <View className="items-center justify-center">
            <View className="rounded-full border-4 border-green-400 w-28 h-28 items-center justify-center">
              <Svg width={64} height={64} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M20 6L9 17l-5-5"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>

            {/* Title */}
            <Text className="text-gray-800 font-semibold text-lg mt-6">
              Payment Successful
            </Text>

            {/* Subtitle with bold amount and recipient */}
            <Text className="text-gray-400 text-base mt-2">
              You paid{" "}
              <Text className="text-gray-800 font-bold">
                {formatMoney(parseFloat(amount))}
              </Text>{" "}
              to <Text className="text-gray-800 font-semibold">Myracetime</Text>
            </Text>
          </View>

          {/* Secured by paystack */}
          <View className="items-center mt-10">
            <View className="flex-row items-center">
              <Text className="text-gray-700">🔒</Text>
              <Text className="text-gray-700 ml-2">Secured by </Text>
              <Text className="text-blue-900 font-bold ml-1">paystack</Text>
            </View>
          </View>

          {/* Button */}
          <HStack className="justify-center items-center flex-1">
            <View className="w-60 items-center mt-10">
              <AppBtn onPress={() => replace("/events")} variant="outline">
                <Box className="justify-center gap-2 items-center flex-row">
                  <Text className="text-[#1A1C1E] font-semibold">
                    Back to Dashboard
                  </Text>
                  <Feather name="arrow-right" size={18} color={"#1A1C1E"} />
                </Box>
              </AppBtn>
            </View>
          </HStack>

          {/* Fill remaining space */}
          <View className="flex-1 bg-white" />
        </View>
      </SafeAreaView>
    </View>
  );
}
