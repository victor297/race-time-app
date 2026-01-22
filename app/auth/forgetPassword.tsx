import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppLayout } from "~/components";
import { ForgetPasswordScreen } from "~/src/screens";
import { AbarType } from "~/src/types";

function ForgetPassword() {
  return (
    <AppLayout appBar={{ variant: AbarType.VARIANT2 }}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        enableOnAndroid={true}
        extraScrollHeight={20}
        showsVerticalScrollIndicator={false}
      >
        <ForgetPasswordScreen />
      </KeyboardAwareScrollView>
    </AppLayout>
  );
}

export default ForgetPassword;
