import { useLocalSearchParams } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppLayout } from "~/components";
import { OtpVerificationScreen } from "~/src/screens";
import { AbarType } from "~/src/types";

function VerifyOtp() {
  const { parent } = useLocalSearchParams();
  return (
    <AppLayout appBar={{ variant: AbarType.VARIANT2 }}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        enableOnAndroid={true}
        extraScrollHeight={20}
        showsVerticalScrollIndicator={false}
      >
        <OtpVerificationScreen page={parent as string} />
      </KeyboardAwareScrollView>
    </AppLayout>
  );
}

export default VerifyOtp;
