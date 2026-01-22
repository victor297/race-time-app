import "react-native-gesture-handler";

import { Stack } from "expo-router";
import "./../global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ModalPortal } from "react-native-modals";
import React from "react";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { asyncStoragePersister, queryClient } from "~/src/lib";
import Toast, { BaseToastProps } from "react-native-toast-message";
import { FullWidthToast } from "~/src/components";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LoadingProvider } from "~/src/context";
import { PaystackProvider } from "react-native-paystack-webview";
import { Constants } from "~/src/utils";
import { Platform, StatusBar } from "react-native";

const toastConfig = {
  success: (props: BaseToastProps) => (
    <FullWidthToast {...props} type="success" />
  ),
  error: (props: BaseToastProps) => <FullWidthToast {...props} type="error" />,
  info: (props: BaseToastProps) => <FullWidthToast {...props} type="info" />,
};

export default function Layout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {Platform.OS === "android" && (
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent={false}
          />
        )}
        <PaystackProvider
          publicKey={Constants.config.paystackPublicKey}
          currency="NGN"
        >
          <GluestackUIProvider>
            <ModalPortal />
            <LoadingProvider>
              <PersistQueryClientProvider
                client={queryClient}
                persistOptions={{
                  persister: asyncStoragePersister,
                  maxAge: 1000 * 60 * 60 * 24,
                }}
              >
                <Stack screenOptions={{ headerShown: false }} />
                <Toast
                  topOffset={0}
                  visibilityTime={5000}
                  config={toastConfig}
                />
              </PersistQueryClientProvider>
            </LoadingProvider>
          </GluestackUIProvider>
        </PaystackProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
