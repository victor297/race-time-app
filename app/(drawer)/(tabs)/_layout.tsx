// app/_layout.tsx
import { Stack, usePathname, router } from "expo-router";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Modal,
  Alert,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import Svg, { Defs, FeDropShadow, Filter, Path } from "react-native-svg";
import { Feather, Ionicons, Octicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useTypedRouter } from "~/src/configs";
import { RouteKey, toUserDto, UserDto } from "~/src/types";
import { HStack } from "~/components/ui/hstack";
import { scale } from "react-native-size-matters";
import { VStack } from "~/components/ui/vstack";
import AppImages from "~/src/configs/AppImages";
import { useProfileStore } from "~/src/store";
import { SplashScreen } from "~/src/screens";
import { useFetch } from "~/src/hooks";

const { width } = Dimensions.get("window");
const tabBarHeight = 78;
const fabSize = 70;
const cutoutRadius = fabSize / 2;

const scaleSvg = width / 375;
const tabSvgHeight = 78 * scaleSvg;
function CustomTabBar() {
  const pathname = usePathname();
  const { replace } = useTypedRouter();
  const tabs = [
    {
      name: "/events" as RouteKey,
      icon: <Octicons name="calendar" size={scale(20)} />,
      title: "Events",
    },
    {
      name: "/feeds" as RouteKey,
      icon: <Feather name="inbox" size={scale(20)} />,
      title: "Feeds",
    },
    {
      name: "add" as RouteKey,
      icon: <Ionicons name="add" size={32} color="#fff" />,
      isFab: true,
    },
    {
      name: "/activities" as RouteKey,
      icon: <Feather name="bar-chart-2" size={scale(20)} />,
      title: "Activities",
    },
    {
      name: "/profile" as RouteKey,
      icon: <Feather name="user" size={scale(20)} />,
      title: "Profile",
    },
  ];
  const [showOptions, setShowOptions] = React.useState<boolean>(false);
  return (
    <>
      <Svg
        width={width}
        height={tabSvgHeight}
        viewBox={`0 0 ${375} 78`}
        style={styles.svg}
      >
        <Defs>
          {/* Drop shadow filter */}
          <Filter id="shadow" x="-50" y="-50" width="500" height="200">
            <FeDropShadow
              dx="0"
              dy="-2" // moves shadow upward
              stdDeviation="15" // blur amount
              floodColor="#000000"
              floodOpacity="0.08" // ~14 hex alpha = 0.08
            />
          </Filter>
        </Defs>

        <Path
          d="M225.224 11.8238C220.181 28.1432 204.975 40 187 40C169.025 40 153.819 28.1432 148.776 11.8238C146.82 5.49178 141.627 0 135 0H12C5.37258 0 0 5.37258 0 12V99H375V12C375 5.37258 369.627 0 363 0H239C232.373 0 227.18 5.49178 225.224 11.8238Z"
          fill="white"
          stroke="#eee"
        />
      </Svg>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showOptions}
        presentationStyle="pageSheet"
        onRequestClose={() => setShowOptions(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowOptions(false)}>
          <View style={styles.centeredView}>
            {/* Prevent taps inside modalView from closing the modal */}
            <TouchableWithoutFeedback>
              <View style={[styles.modalView, { width: width, height: 240 }]}>
                <View className="flex-1 flex-row items-center justify-center gap-20">
                  <TouchableOpacity
                    onPress={() => {
                      setShowOptions(false);
                      router.push("modal/connect-app");
                    }}
                  >
                    <VStack className="justify-center items-center gap-2">
                      <Image source={AppImages.runAlt} />
                      <Text className="text-white text-[12px] font-[600]">
                        Submit your Run
                      </Text>
                    </VStack>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setShowOptions(false);
                      router.push("modal/post");
                    }}
                  >
                    <VStack className="justify-center items-center gap-2">
                      <Image source={AppImages.shareAlt} />
                      <Text className="text-white text-[12px] font-[600]">
                        Share a Post
                      </Text>
                    </VStack>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <View style={styles.tabBar}>
        <HStack style={{ width: "40%" }}>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => replace(tabs[0].name)}
          >
            {React.cloneElement(tabs[0].icon, {
              color: pathname.includes(tabs[0].name) ? "#FD2828" : "#C8D1E1",
            })}
            {React.cloneElement(<Text>{tabs[0].title}</Text>, {
              className: pathname.includes(tabs[0].name)
                ? "text-primary-500"
                : "text-neutral",
            })}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => replace(tabs[1].name)}
          >
            {React.cloneElement(tabs[1].icon, {
              color: pathname.includes(tabs[1].name) ? "#FD2828" : "#C8D1E1",
            })}
            {React.cloneElement(<Text>{tabs[1].title}</Text>, {
              className: pathname.includes(tabs[1].name)
                ? "text-primary-500"
                : "text-neutral",
            })}
          </TouchableOpacity>
        </HStack>
        <View style={styles.fabContainer}>
          <TouchableOpacity
            style={styles.fabButton}
            onPress={() => router.push("modal/post")}
          >
            {tabs[2].icon}
          </TouchableOpacity>
        </View>
        <HStack style={{ width: "40%" }}>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => replace(tabs[3].name)}
          >
            {React.cloneElement(tabs[3].icon, {
              color: pathname.includes(tabs[3].name) ? "#FD2828" : "#C8D1E1",
            })}
            {React.cloneElement(<Text>{tabs[3].title}</Text>, {
              className: pathname.includes(tabs[3].name)
                ? "text-primary-500"
                : "text-neutral",
            })}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => replace(tabs[4].name)}
          >
            {React.cloneElement(tabs[4].icon, {
              color: pathname.includes(tabs[4].name) ? "#FD2828" : "#C8D1E1",
            })}
            {React.cloneElement(<Text>{tabs[4].title}</Text>, {
              className: pathname.includes(tabs[4].name)
                ? "text-primary-500"
                : "text-neutral",
            })}
          </TouchableOpacity>
        </HStack>
      </View>
    </>
  );
}

export default function Layout() {
  const [checking, setChecking] = useState(true);
  const { setProfile, clearProfileData } = useProfileStore();
  const { data, isLoading, error, status } = useFetch<UserDto>(
    ["user_profile"],
    "users/profile",
    { enabled: true, forceRefetch: true }
  );
  useEffect(() => {
    clearProfileData();
  }, [clearProfileData]);
  useEffect(() => {
    if (!isLoading && data?.data && !error) {
      setProfile(toUserDto(data.data));
    }
    setChecking(isLoading);
  }, [data, isLoading, error]);

  if (checking) return <SplashScreen />;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <CustomTabBar />
    </>
  );
}

const styles = StyleSheet.create({
  svg: {
    position: "absolute",
    bottom: 0,
    zIndex: 1,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: tabBarHeight,
    position: "absolute",
    bottom: 0,
    width: width,
    zIndex: 2,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    marginBottom: 20,
  },
  fabContainer: {
    position: "absolute",
    bottom: 20,
    left: width / 2 - cutoutRadius,
    width: fabSize,
    height: fabSize,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },
  fabButton: {
    width: fabSize,
    height: fabSize,
    borderRadius: cutoutRadius,
    backgroundColor: "#FD2828",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 10,
  },

  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "baseline",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalView: {
    margin: 0,
    backgroundColor: "#303030",
    borderRadius: 0,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
