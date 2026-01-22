import { Link, useLocalSearchParams } from "expo-router";
import React, { useRef } from "react";
import { Text } from "react-native";
import { Box } from "~/components/ui/box";
import { VStack } from "~/components/ui/vstack";
import { AnimatedView, AppBtn } from "~/src/components";
import { OtpInput, OtpInputRef } from "react-native-otp-entry";
import { useTypedRouter } from "~/src/configs";
import { useLoading } from "~/src/context";
import { useCreate } from "~/src/hooks";
import { EmailVerifyResponse, ResentOtpResponse } from "~/src/types";
import Toast from "react-native-toast-message";
import { useAuthStore } from "~/src/store";
function OtpVerificationScreen({ page }: { page: string }) {
  const { replace, push } = useTypedRouter();
  const { showLoading, hideLoading } = useLoading();
  const [otp, setOtp] = React.useState<string>("");
  const otpRef = useRef<OtpInputRef>(null);
  const { parent, email } = useLocalSearchParams<{
    parent?: string;
    email?: string;
    name?: string;
  }>();
  const setToken = useAuthStore((s) => s.setToken);
  const { mutate, isPending } = useCreate<EmailVerifyResponse>(
    "v2/auth/verify-email"
  );
  const handleClear = () => {
    otpRef.current?.clear();
    setOtp("");
  };

  const onVerify = (newOtp: any) => {
    try {
      if (!newOtp) return;
      const formData = {
        email: email,
        otp: newOtp,
        isPasswordReset: parent != "register",
      };
      console.log(formData);
      mutate(formData, {
        onSuccess: async (res) => {
          console.log("Response", res);
          Toast.show({
            type: "success",
            text1: "Verified",
            text2: res.data.message ?? res.message,
          });
          if (parent == "forgotPasword") {
            push({
              pathname: "/auth/resetPassword",
              params: {
                email: email,
                token: res.data.token,
              },
            } as any);
          } else if (parent == "register") {
            await setToken(res.data.token);
            replace("/events");
          } else {
            replace("/auth/login");
          }
        },
        onError: (error) => {
          Toast.show({ type: "error", text1: "Error", text2: error.message });
          handleClear();
        },
      });
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An error occurred!",
      });
      handleClear();
    }
  };
  const { mutate: request } = useCreate<ResentOtpResponse>("v2/auth/resentOtp");
  const resentOtp = async () => {
    showLoading();
    console.log(email);
    try {
      request(
        { email: email },
        {
          onSuccess: async (res) => {
            console.log("Response", res);
            Toast.show({
              type: "success",
              text1: "Sent",
              text2: res.data.message ?? res.message,
              visibilityTime: 5000,
            });
            hideLoading();
          },
          onError: (error) => {
            Toast.show({ type: "error", text1: "Error", text2: error.message });
            hideLoading();
          },
        }
      );
    } catch (err: any) {
      console.error("Login error:", err.message);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An error occurred!",
      });
      hideLoading();
    }
  };
  return (
    <VStack
      className="px-[20px]"
      style={{ marginTop: 20,}}
      space="sm"
    >
      <AnimatedView variant="fade">
        <Text className="text-title font-bold text-typography-title">
          OTP Verification
        </Text>
      </AnimatedView>
      <AnimatedView variant="fade">
        <Text className="text-3xs text-typography-subtle">
          Enter the verification code we just sent to your email address
        </Text>
      </AnimatedView>
      <AnimatedView variant="fade" className="mt-4">
        <OtpInput
          ref={otpRef}
          numberOfDigits={6}
          //   focusColor="green"
          autoFocus={true}
          hideStick={true}
          //   placeholder="******"
          blurOnFilled={true}
          disabled={false}
          type="numeric"
          secureTextEntry={false}
          focusStickBlinkingDuration={500}
          onFocus={() => console.log("Focused")}
          onBlur={() => console.log("Blurred")}
          onTextChange={(text) => setOtp(text)}
          onFilled={(text) => {
            setOtp(text);
            onVerify(text);
          }}
          textInputProps={{
            accessibilityLabel: "One-Time Password",
          }}
          textProps={{
            accessibilityRole: "text",
            accessibilityLabel: "OTP digit",
            allowFontScaling: false,
          }}
          theme={{
            containerStyle: {
              width: "100%",
            },
            pinCodeContainerStyle: {
              height: 56,
              width: 56,
              borderWidth: 0.9,
              borderColor: "#E6E6E6",
              borderRadius: 8,
            },
            pinCodeTextStyle: {
              color: "#404040",
              fontSize: 24,
              fontWeight: "500",
            },
            focusedPinCodeContainerStyle: {
              borderColor: "#FD2828B2",
            },
            // placeholderTextStyle: styles.placeholderText,
            filledPinCodeContainerStyle: {
              borderColor: "#FD2828B2",
            },
          }}
        />
      </AnimatedView>
      <VStack space={"md"} className="mt-4">
        <AnimatedView variant="fade">
          <AppBtn
            title="Verify"
            loadingText="Verifying..."
            loading={isPending}
            enabled={otp.length == 6}
            onPress={() => onVerify(otp)}
          />
        </AnimatedView>
        <Box className="mt-10 text-center">
          <AnimatedView variant="slideY" direction="bottom">
            <Text className="text-center">
              Didn’t receive a code?
              <Link
                href={"/auth/login"}
                className="px-2 text-primary-500 py-2"
                onPress={(e) => {
                  e.preventDefault();
                  resentOtp();
                }}
              >
                {" "}
                Resend
              </Link>
            </Text>
          </AnimatedView>
        </Box>
      </VStack>
    </VStack>
  );
}

export default OtpVerificationScreen;
