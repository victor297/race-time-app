import React from "react";
import { Pressable, Text, ActivityIndicator } from "react-native";
import clsx, { ClassValue } from "clsx";
import { Box } from "~/components/ui/box";

type Variant = "solid" | "outline" | "default";

interface AppBtnProps {
  title?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  variant?: Variant;
  enabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  className?: string;
  // Tailwind spacing utilities
  px?: keyof typeof pxMap;
  py?: keyof typeof pyMap;
  pt?: keyof typeof ptMap;
  pb?: keyof typeof pbMap;
  pl?: keyof typeof plMap;
  pr?: keyof typeof prMap;
  r?: keyof typeof radiusMap;
  w?: ClassValue;
}

const pxMap = {
  0: "px-0",
  2: "px-2",
  3: "px-3",
  4: "px-4",
  5: "px-5",
  6: "px-6",
};
const pyMap = {
  2: "py-2",
  3: "py-3",
  4: "py-4",
  5: "py-5",
};
const ptMap = {
  2: "pt-2",
  3: "pt-3",
  4: "pt-4",
};
const pbMap = {
  2: "pb-2",
  3: "pb-3",
  4: "pb-4",
};
const plMap = {
  2: "pl-2",
  3: "pl-3",
  4: "pl-4",
};
const prMap = {
  2: "pr-2",
  3: "pr-3",
  4: "pr-4",
};
const radiusMap = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

export default function AppBtn({
  title,
  children,
  onPress,
  variant = "solid",
  enabled = true,
  loading = false,
  loadingText,
  className,
  px = 4,
  py,
  pt,
  pb,
  pl,
  pr,
  r = "lg",
  w = "w-full",
}: AppBtnProps) {
  const isDisabled = !enabled || loading;
  // ----- Variant styles -----
  const baseStyle = "flex-row items-center justify-center h-[44px]";
  const variantStyles: Record<Variant, string> = {
    solid: clsx(isDisabled ? "bg-primary-300" : "bg-primary-500"),
    outline: clsx(
      "bg-white border",
      "border-outline-100",
      isDisabled && "opacity-50"
    ),
    default: clsx("bg-[#EDF1F3]", isDisabled && "opacity-50"),
  };
  const disabledStyles: Record<Variant, string> = {
    solid: "bg-primary-300",
    outline: "opacity-50",
    default: "opacity-50",
  };
  // ----- Text styles -----
  const textStyles: Record<Variant, string> = {
    solid: "text-white font-semibold text-base leading-[44px]",
    outline: "text-black font-semibold text-base leading-[44px]",
    default: "text-black font-medium text-base leading-[44px]",
  };

  // ----- Spacing and radius -----
  const spacing = clsx(
    px && pxMap[px],
    py && pyMap[py],
    pt && ptMap[pt],
    pb && pbMap[pb],
    pl && plMap[pl],
    pr && prMap[pr],
    r && radiusMap[r]
  );

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}
      className={clsx(
        baseStyle,
        variantStyles[variant],
        isDisabled && disabledStyles[variant],
        spacing,
        w,
        className
      )}
    >
      {loading ? (
        <Box className="flex-1 flex-row justify-center align-middle items-center">
          <ActivityIndicator
            size="small"
            color={variant === "solid" ? "#fff" : "#000"}
          />
          {loadingText ? (
            <Text className={clsx(textStyles[variant], "ml-2")}>
              {loadingText}
            </Text>
          ) : null}
        </Box>
      ) : children ? (
        children
      ) : (
        <Text className={clsx(textStyles[variant], "text-center flex-1")}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}
