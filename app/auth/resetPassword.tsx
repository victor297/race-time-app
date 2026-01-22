import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppLayout } from "~/components";
import { ResetPasswordScreen } from "~/src/screens";

function ResetPassword() {
  return (
    <AppLayout>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        enableOnAndroid={true}
        extraScrollHeight={20}
        showsVerticalScrollIndicator={false}
      >
        <ResetPasswordScreen />
      </KeyboardAwareScrollView>
    </AppLayout>
  );
}

export default ResetPassword;
