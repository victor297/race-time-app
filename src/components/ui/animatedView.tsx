import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Easing } from "react-native-reanimated";
import { MotiView } from "moti";

type Direction = "left" | "right" | "top" | "bottom";
type Variant = "slideX" | "slideY" | "fade" | "scale" | "scaleX" | "scaleY";

interface AnimatedViewProps {
  children?: React.ReactNode;
  variant?: Variant;
  direction?: Direction;
  delay?: number;
  duration?: number;
  loop?: boolean;
  easing?: "easeIn" | "easeOut" | "linear";
  visible?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * A reusable animated container built with Moti.
 */
const AnimatedView: React.FC<AnimatedViewProps> = ({
  children,
  variant = "fade",
  direction = "bottom",
  delay = 0,
  duration = 500,
  loop = false,
  easing = "easeOut",
  visible = true,
  className,
  style,
}) => {
  // Map easing string → Easing function
  const easingFn = {
    easeIn: Easing.in(Easing.ease),
    easeOut: Easing.out(Easing.ease),
    linear: Easing.linear,
  }[easing];

  // Determine starting style based on variant + direction
  const from = (() => {
    switch (variant) {
      case "slideX":
        return { opacity: 0, translateX: direction === "left" ? -50 : 50 };
      case "slideY":
        return { opacity: 0, translateY: direction === "top" ? -50 : 50 };
      case "scale":
        return { opacity: 0, scale: 0.8 };
      case "scaleX":
        return { opacity: 0, scaleX: 0.8 };
      case "scaleY":
        return { opacity: 0, scaleY: 0.8 };
      default:
        return { opacity: 0 };
    }
  })();

  // Final style
  const animate = visible
    ? {
        opacity: 1,
        translateX: 0,
        translateY: 0,
        scale: 1,
        scaleX: 1,
        scaleY: 1,
      }
    : from; // for toggling out

  const transition = {
    type: "timing" as const,
    delay,
    duration,
    easing: easingFn,
    loop,
  };

  return (
    <MotiView
      from={from}
      animate={animate}
      transition={transition}
      className={className}
      style={style}
    >
      {children}
    </MotiView>
  );
};
export default AnimatedView;
