import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppLayout } from "~/components";
import { LoginScreen } from "~/src/screens";

function LoginPage() {
  return (
    <AppLayout>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        enableOnAndroid={true}
        extraScrollHeight={20}
        showsVerticalScrollIndicator={false}
      >
        <LoginScreen />
      </KeyboardAwareScrollView>
    </AppLayout>
  );
}

export default LoginPage;
