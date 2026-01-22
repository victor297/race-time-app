import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  text1?: string;
  text2?: string;
  type?: "success" | "error" | "info";
};

export default function FullWidthToast({ text1, text2, type }: Props) {
  const insets = useSafeAreaInsets();

  const backgroundColor =
    type === "error" ? "#FF3B30" : type === "success" ? "#34C759" : "#007AFF";

  return (
    <View
      style={[styles.container, { backgroundColor, paddingTop: insets.top }]}
    >
      <StatusBar
        translucent
        backgroundColor={backgroundColor}
        barStyle="light-content"
      />
      <View style={styles.row}>
        <Ionicons
          name={
            type === "error"
              ? "close-circle"
              : type === "success"
                ? "checkmark-circle"
                : "information-circle"
          }
          size={20}
          color="#fff"
          style={styles.icon}
        />
        <Text style={styles.text1}>{text1}</Text>
      </View>
      {text2 ? <Text style={styles.text2}>{text2}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  text1: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  text2: {
    color: "#fff",
    fontSize: 14,
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
});
