// ~/src/context/LoadingContext.tsx
import React, { createContext, useContext, useState } from "react";
import { Modal, View, ActivityIndicator, Text, StyleSheet } from "react-native";

const LoadingContext = createContext({
  showLoading: () => {},
  hideLoading: () => {},
});

export const LoadingProvider = ({ children }: any) => {
  const [visible, setVisible] = useState(false);

  return (
    <LoadingContext.Provider
      value={{
        showLoading: () => setVisible(true),
        hideLoading: () => setVisible(false),
      }}
    >
      {children}
      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={{ marginTop: 10, color: "white" }}>
              Please wait...
            </Text>
          </View>
        </View>
      </Modal>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(253, 40, 40, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderBox: {
    backgroundColor: "transparent",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },
});
