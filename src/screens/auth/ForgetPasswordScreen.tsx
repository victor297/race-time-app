import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { useForm } from "react-hook-form";
import { Text } from "react-native";
import Toast from "react-native-toast-message";
import { Box } from "~/components/ui/box";
import { VStack } from "~/components/ui/vstack";
import { AnimatedView, AppBtn, AppForm } from "~/src/components";
import { useTypedRouter } from "~/src/configs";
import { useCreate } from "~/src/hooks";
import {
  FieldType,
  ForgotPasswordFormData,
  forgotPasswordSchema,
  FormField,
  FormProps,
} from "~/src/types";

function ForgetPasswordScreen() {
  const { push } = useTypedRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    values: {
      email: "",
    },
  });
  const form: FormProps<ForgotPasswordFormData> = {
    control,
    errors: errors,
    field: [
      {
        name: "email",
        title: "Email",
        inputType: FieldType.EMAIL,
        autoComplete: "email",
        autoCapitalize: "none",
      },
    ] as FormField[],
  };
  const { mutate, isPending } = useCreate<any>("v2/auth/forgot-password");
  const onSubmit = (data: ForgotPasswordFormData) => {
    try {
      mutate(data, {
        onSuccess: async (res) => {
          console.log("Response", res);
          Toast.show({
            type: "success",
            text1: "Sent",
            text2: res.data.message ?? res.message,
          });
          // await setToken(res.data.token);
          // replace("/events");
          push({
            pathname: "/auth/verify",
            params: { parent: "forgotPasword", email: data.email },
          } as any);
        },
        onError: (error) => {
          Toast.show({ type: "error", text1: "Error", text2: error.message });
        },
      });
    } catch (err: any) {
      console.error("Login error:", err.message);
      Toast.show({ type: "error", text1: "Error", text2: err.message });
    }
  };
  return (
    <>
      <VStack className="space-y-20" style={{ marginTop: 20 }} space="sm">
        <AnimatedView variant="fade">
          <Text className="text-title font-bold text-typography-title">
            Forget Password
          </Text>
        </AnimatedView>
        <AnimatedView variant="fade" className="mt-2">
          <Text className="text-3xs text-typography-subtle">
            Enter your email, and we’ll send a link to your email to reset your
            password
          </Text>
        </AnimatedView>
        <AnimatedView variant="fade" className="mt-4">
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
                Remember password?
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

export default ForgetPasswordScreen;
