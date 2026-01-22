import { Dimensions, Pressable, Text, View } from "react-native";
import { Box } from "~/components/ui/box";
import React from "react";
import { AnimatedView } from "~/src/components";
import { SceneMap, TabView } from "react-native-tab-view";
import { AllEvents, CompletedEvents, UpcomingEvents } from "../events";

const LazyPlaceholder = () => (
  <View className="flex-1 items-center justify-center">
    <Text>Loading…</Text>
  </View>
);

export default function EventsScreen() {
  const [index, setIndex] = React.useState<number>(0);
  const [routes] = React.useState([
    { key: "first", title: "All" },
    { key: "second", title: "Completed" },
    { key: "third", title: "Upcoming" },
  ]);

  const _renderLazyPlaceholder = () => <LazyPlaceholder />;
  const _handleIndexChange = (index: number) => setIndex(index);

  const renderTabBar = (props: any) => {
    const inputRange = props.navigationState.routes.map(
      (x: any, i: number) => i
    );

    return (
      <Box
        className="flex-row justify-start bg-[#7676801F]"
        style={{
          height: 32,
          marginTop: 8,
          marginBottom: 8,
          overflow: "hidden",
          padding: 2,
          borderRadius: 7,
          marginLeft: 20,
          marginRight:20,
        }}
      >
        {props.navigationState.routes.map((route: any, i: number) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex: number) =>
              inputIndex === i ? 1 : 0.5
            ),
          });

          const isActive = index === i;
          const bgColor = isActive ? "#FFFFFF" : "#7676801F";

          return (
            <Pressable
              key={i}
              onPress={() => setIndex(i)}
              style={{
                flex: 1,
                height: "100%",
                backgroundColor: bgColor,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: isActive ? 7 : 0,
                elevation: isActive ? 2 : 0,
              }}
            >
              <AnimatedView variant="scale">
                <Text
                  style={{
                    color: "#000000",
                    fontSize: 14,
                    fontWeight: "500",
                    lineHeight: 20,
                  }}
                >
                  {route.title}
                </Text>
              </AnimatedView>

              {/* Custom border line */}
              {i === 0 && index === 2 && (
                <View
                  style={{
                    position: "absolute",
                    right: 0,
                    width: 1,
                    height: "60%", // 👈 shorter than 100%
                    backgroundColor: "#3C3C435C",
                  }}
                />
              )}
              {i === 2 && index === 0 && (
                <View
                  style={{
                    position: "absolute",
                    left: 0,
                    width: 1,
                    height: "60%", // 👈 shorter than 100%
                    backgroundColor: "#3C3C435C",
                  }}
                />
              )}
            </Pressable>
          );
        })}
      </Box>
    );
  };

  return (
    <View className="flex-1 bg-white px-0 mt-3">
      <TabView
        lazy
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          first: AllEvents,
          second: CompletedEvents,
          third: UpcomingEvents,
        })}
        renderLazyPlaceholder={_renderLazyPlaceholder}
        onIndexChange={_handleIndexChange}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={renderTabBar}
      />
    </View>
  );
}
