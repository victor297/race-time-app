import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { Text } from "react-native";
import Toast from "react-native-toast-message";
import { Box } from "~/components/ui/box";
import { VStack } from "~/components/ui/vstack";
import { AnimatedView, AppBtn, AppForm } from "~/src/components";
import { useTypedRouter } from "~/src/configs";
import { useCreate } from "~/src/hooks";
import { useAuthStore } from "~/src/store";
import {
  FieldType,
  FormField,
  FormProps,
  PasswordResetForm,
  passwordResetSchema,
} from "~/src/types";

function ResetPasswordScreen() {
  const { replace } = useTypedRouter();
  const setToken = useAuthStore((s) => s.setToken);
  const { token, email } = useLocalSearchParams<{
    email?: string;
    token?: string;
  }>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetForm>({
    resolver: zodResolver(passwordResetSchema),
    values: {
      password: "",
      password2: "",
    },
  });
  const form: FormProps<PasswordResetForm> = {
    control,
    errors: errors,
    field: [
      {
        name: "password",
        title: "New Password",
        inputType: FieldType.PASSWORD,
      },
      {
        name: "password2",
        title: "Confirm Password",
        inputType: FieldType.PASSWORD,
      },
    ] as FormField[],
  };
  const { mutate, isPending } = useCreate<any>("v2/auth/reset-password");
  const onSubmit = (data: PasswordResetForm) => {
    // replace("/events");
    if (!token) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Verification failed",
      });
      return;
    }
    try {
      mutate(
        {
          newPassword: data.password,
          email: email,
        },
        {
          onSuccess: async (res) => {
            console.log("Response", res);
            Toast.show({
              type: "success",
              text1: "Password reseted",
              text2: res.data.message ?? res.message,
            });
            await setToken(token ?? "");
            replace("/events");
          },
          onError: (error) => {
            Toast.show({ type: "error", text1: "Error", text2: error.message });
          },
        }
      );
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Error", text2: error.message });
    }
  };
  return (
    <>
      <VStack
        className="space-y-20"
        style={{ marginTop: 20}}
        space="sm"
      >
        <AnimatedView variant="fade">
          <Text className="text-title font-bold text-typography-title">
            Reset Password
          </Text>
        </AnimatedView>
        <AnimatedView variant="fade">
          <Text className="text-3xs text-typography-subtle">
            Enter your new password
          </Text>
        </AnimatedView>
        <AnimatedView variant="fade" className="mt-2">
          <AppForm form={form} />
        </AnimatedView>
        <VStack space={"md"}>
          <AnimatedView variant="fade">
            <AppBtn
              loading={isPending}
              loadingText="Please wait..."
              title="Continue"
              onPress={handleSubmit(onSubmit)}
            />
          </AnimatedView>
          <Box className="mt-10 text-center">
            <AnimatedView variant="slideY" direction="bottom">
              <Text className="text-center">
                Back to login?
                <Link
                  href={"/auth/login"}
                  className="px-2 text-primary-500 py-2"
                  replace
                >
                  {" "}
                  Login
                </Link>
              </Text>
            </AnimatedView>
          </Box>
        </VStack>
      </VStack>
    </>
  );
}

export default ResetPasswordScreen;
