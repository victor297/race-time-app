import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppLayout } from "~/components";
import { RegisterScreen } from "~/src/screens";
import { AbarType } from "~/src/types";

function RegisterPage() {
  return (
    <AppLayout
      appBar={{ variant: AbarType.VARIANT2 }}
      onBackPress={() => {
        router.back();
      }}
    >
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        enableOnAndroid={true}
        extraScrollHeight={20}
        showsVerticalScrollIndicator={false}
      >
        <RegisterScreen />
      </KeyboardAwareScrollView>
    </AppLayout>
  );
}

export default RegisterPage;
