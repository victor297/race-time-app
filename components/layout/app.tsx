import React from "react";
import AppBackground from "./background";
import { AbarType, AppLayoutProps } from "~/src/types";
import Constants from "expo-constants";
import { Image, Platform, StatusBar, StyleSheet, View } from "react-native";
import { HStack } from "../ui/hstack";
import { AnimatedView } from "~/src/components";
import { VStack } from "../ui/vstack";
import AppImages from "~/src/configs/AppImages";
import { verticalScale, scale } from "react-native-size-matters";
import { Button } from "../ui/button";
import BackIcon from "@/assets/icons/backIcon.svg";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
function AppLayout({
  children,
  withBackground = true,
  appBar,
  bgColor,
  onBackPress,
}: AppLayoutProps) {
  const statusBarHeight = Constants.statusBarHeight;
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <AppBackground withBackground={withBackground}>
        <View
          style={{
            paddingTop: statusBarHeight,
            flex: 1,
          }}
        >
          <VStack style={{ flex: 1 }}>
            {(!appBar?.variant || appBar?.variant == AbarType.VARIANT1) && (
              <HStack
                className="justify-between items-center h-[48px] w-full"
                style={{ paddingHorizontal: 20 }}
              >
                <AnimatedView variant="scaleX" direction="left">
                  <Image
                    source={AppImages.logo}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </AnimatedView>
                <AnimatedView variant="scaleX" direction="right">
                  <HStack className="flex justify-end items-center">
                    {appBar?.action?.map((a, i) => (
                      <AnimatedView key={`appbar_action_${i}`}>
                        {a}
                      </AnimatedView>
                    ))}
                  </HStack>
                </AnimatedView>
              </HStack>
            )}
            {appBar?.variant && appBar?.variant == AbarType.VARIANT2 && (
              <HStack
                className="justify-between items-center h-[48px] w-full"
                style={{ paddingHorizontal: 20 }}
              >
                <AnimatedView variant="scaleX" direction="left">
                  <Button
                    variant={"link"}
                    onPress={() => {
                      if (onBackPress) {
                        onBackPress();
                      } else {
                        router.back();
                      }
                    }}
                  >
                    {Platform.OS == "ios" ? (
                      <MaterialIcons
                        name="arrow-back-ios"
                        size={24}
                        color="black"
                      />
                    ) : (
                      <BackIcon height={24} width={24} />
                    )}
                  </Button>
                </AnimatedView>
                <AnimatedView variant="scaleX" direction="right">
                  <Image
                    source={AppImages.logo}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </AnimatedView>
              </HStack>
            )}

            <View style={{ flex: 1, backgroundColor: bgColor ?? "#fff" }}>
              {children}
            </View>
          </VStack>
        </View>
      </AppBackground>
    </>
  );
}

export default AppLayout;
const styles = StyleSheet.create({
  logo: {
    width: scale(103),
    height: verticalScale(32.45),
  },
});
