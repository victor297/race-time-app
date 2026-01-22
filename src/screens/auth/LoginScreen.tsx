import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormField,
  FormProps,
  LoginFormData,
  LoginResponse,
  loginSchema,
} from "~/src/types";
import { VStack } from "~/components/ui/vstack";
import { AnimatedView, AppBtn, AppForm } from "~/src/components";
import { Text } from "moti";
import { HStack } from "~/components/ui/hstack";
import { Link } from "expo-router";
import React from "react";
import { Divider } from "~/components/ui/divider";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "~/components/ui/checkbox";
import { CheckIcon } from "~/components/ui/icon";
import { Box } from "~/components/ui/box";
import { Button } from "~/components/ui/button";
import { Image } from "react-native";
import AppImages from "~/src/configs/AppImages";
import { useTypedRouter } from "~/src/configs";
import { router } from "expo-router";
import { useAuthStore } from "~/src/store";
import { useCreate } from "~/src/hooks";
import Toast from "react-native-toast-message";
function LoginScreen() {
  const { replace } = useTypedRouter();
  const setToken = useAuthStore((s) => s.setToken);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    values: {
      email: "",
      password: "",
    },
  });

  const form: FormProps<LoginFormData> = {
    control,
    errors: errors,
    field: [
      {
        name: "email",
        title: "Email",
        inputType: "email",
        autoCapitalize: "none",
        autoComplete: "email",
      } as FormField,
      {
        name: "password",
        title: "Password",
        inputType: "password",
        autoCapitalize: "none",
      } as FormField,
    ] as FormField[],
  };
  const { mutate, isPending } = useCreate<LoginResponse>("v2/auth/login");
  const onSubmit = async (data: LoginFormData) => {
    try {
      mutate(data, {
        onSuccess: async (res) => {
          if (res && res.data.token) {
            await setToken(res.data.token);
            replace("/events");
          } else {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: res.message ?? res.data.message,
            });
          }
        },
        onError: (error) => {
          console.log("Error", error);
          Toast.show({
            type: "error",
            text1: "Error",
            text2: error.message ?? error,
          });
        },
      });
    } catch (err: any) {
      console.error("Login error:", err.message);
    }
  };
  return (
    <>
      <VStack className="space-y-20" style={{ marginTop: 20 }} space="sm">
        <AnimatedView variant="fade">
          <Text className="text-title font-bold text-typography-title">
            Sign in to your Account
          </Text>
        </AnimatedView>
        <AnimatedView variant="fade">
          <Text className="text-3xs text-typography-subtle">
            Enter your email and password to log in
          </Text>
        </AnimatedView>
        <AnimatedView variant="fade" className="mt-4">
          <AppForm form={form} />
        </AnimatedView>
        <VStack space={"md"}>
          <HStack className="mb-4 flex justify-between">
            <AnimatedView variant="slideX" direction="left">
              <Checkbox
                isDisabled={false}
                isInvalid={false}
                size="lg"
                value={"1"}
              >
                <CheckboxIndicator className="border border-[#EDF1F3]">
                  <CheckboxIcon
                    className="bg-primary-300 rounded-sm text-white"
                    as={CheckIcon}
                  />
                </CheckboxIndicator>
                <CheckboxLabel className="text-typography-subtle font-normal">
                  Remember me
                </CheckboxLabel>
              </Checkbox>
            </AnimatedView>
            <AnimatedView variant="slideX" direction="right">
              <Button
                variant={"link"}
                className="focus:bg-primary-50 active:bg-primary-50"
                onPress={() => {
                  router.push("/auth/forgetPassword");
                }}
              >
                <Text className="text-primary-500">Forgot Password ?</Text>
              </Button>
            </AnimatedView>
          </HStack>
          <AnimatedView variant="fade">
            <AppBtn
              loading={isPending}
              loadingText="Logging in..."
              title="Log In"
              onPress={handleSubmit(onSubmit)}
            />
          </AnimatedView>
          <HStack className="flex justify-between items-center mt-4 mb-4">
            <Box className="w-40 pr-10" style={{ width: "44%" }}>
              <Divider />
            </Box>
            <Text>Or</Text>
            <Box className="w-48 pl-10" style={{ width: "44%" }}>
              <Divider />
            </Box>
          </HStack>
          <AnimatedView variant="fade">
            <AppBtn variant="outline" className="mb-4">
              <HStack space={"sm"}>
                <Image source={AppImages.google} />
                <Text className="text-typography-title text-14px">
                  Continue with Google
                </Text>
              </HStack>
            </AppBtn>
          </AnimatedView>
          <AnimatedView variant="fade">
            <AppBtn variant="outline" className="mb-4">
              <HStack space={"sm"}>
                <Image source={AppImages.facebook} />
                <Text className="text-typography-title text-14px">
                  Continue with Facebook
                </Text>
              </HStack>
            </AppBtn>
          </AnimatedView>
          <Box className="mt-10 text-center">
            <AnimatedView variant="slideY" direction="bottom">
              <Text className="text-center">
                Don’t have an account?
                <Link
                  href={"/auth/register"}
                  className="px-2 text-primary-500 py-2"
                  onPress={(e) => {
                    e.preventDefault();
                    router.push("/auth/register");
                  }}
                >
                  {" "}
                  Sign Up
                </Link>
              </Text>
            </AnimatedView>
          </Box>
        </VStack>
      </VStack>
    </>
  );
}

export default LoginScreen;
