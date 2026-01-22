import React, { useEffect } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { AppBackground } from "~/components";
import AppImages from "~/src/configs/AppImages";

const { width } = Dimensions.get("window");

const SplashScreen = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 3000 }), -1, true);
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 0.5, 1],
      ["#FD2828", "#0AD46F", "#4D94FF"]
    );
    return { backgroundColor };
  });
  return (
    <AppBackground>
      <View style={styles.container}>
        <Animated.View style={styles.logoWrapper}>
          <Image source={AppImages.logo} resizeMode="contain" />
        </Animated.View>
      </View>

      <View className="mb-20 flex justify-center items-center">
        <View style={styles.barContainer}>
          <Animated.View style={[styles.bar, animatedStyle]} />
        </View>
      </View>
    </AppBackground>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  logoWrapper: {
    width: 275,
    height: 88,
    justifyContent: "center",
    alignItems: "center",
  },
  barContainer: {
    width: width * 0.8,
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    overflow: "hidden",
  },
  bar: {
    flex: 1,
    borderRadius: 2,
  },
});
