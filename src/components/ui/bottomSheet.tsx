import React, { ReactNode, useCallback } from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  height?: number;
  duration?: number;
  backdropOpacity?: number;
};

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  children,
  height = SCREEN_HEIGHT * 0.4,
  duration = 300,
  backdropOpacity = 0.4,
}) => {
  const progress = useSharedValue(visible ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(visible ? 1 : 0, { duration });
  }, [visible]);

  const animatedSheet = useAnimatedStyle(() => {
    const translateY = interpolate(
      progress.value,
      [0, 1],
      [height, 0],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateY }],
    };
  });

  const animatedBackdrop = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, backdropOpacity]),
    pointerEvents: progress.value === 0 ? "none" : "auto",
  }));

  const handleClose = useCallback(() => {
    progress.value = withTiming(0, { duration });
    setTimeout(onClose, duration);
  }, [onClose]);

  return (
    <>
      {/* BACKDROP */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[styles.backdrop, animatedBackdrop]} />
      </TouchableWithoutFeedback>

      {/* SHEET */}
      <Animated.View style={[styles.sheet, { height }, animatedSheet]}>
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    zIndex: 5,
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 10,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default BottomSheet;
