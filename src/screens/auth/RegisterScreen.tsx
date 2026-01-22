import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FieldSelectOption,
  FieldType,
  FormField,
  FormProps,
  RegisterFormData,
  RegisterResponse,
  RegisterSchema,
} from "~/src/types";
import { VStack } from "~/components/ui/vstack";
import { AnimatedView, AppBtn, AppForm } from "~/src/components";
import { Text } from "moti";
import { Link } from "expo-router";
import React from "react";
import { Box } from "~/components/ui/box";
import { useTypedRouter } from "~/src/configs";
import { useCreate } from "~/src/hooks";
import Toast from "react-native-toast-message";
import { useAuthStore, useRegisterStore } from "~/src/store";

function RegisterScreen() {
  const { push, replace } = useTypedRouter();

  const setRegister = useRegisterStore((s) => s.setRegister);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    values: {
      email: "",
      password: "",
      country: "Nigeria",
      fullname: "",
      phoneNumber: "",
      password2: "",
    },
  });
  const countryOptions: FieldSelectOption = {
    id: "id",
    label: "name",
    list: [
      {
        id: 1,
        name: "Name 1",
      },
      {
        id: 2,
        name: "Name 2",
      },
    ],
    source: "country",
  };
  const form: FormProps<RegisterFormData> = {
    control,
    errors: errors,
    field: [
      { name: "fullname", title: "Fullname", inputType: FieldType.FULLNAME },
      {
        name: "email",
        title: "Email",
        inputType: FieldType.EMAIL,
        autoComplete: "email",
        autoCapitalize: "none",
      },
      {
        name: "country",
        title: "Country",
        inputType: FieldType.SELECT,
        option: countryOptions,
      } as FormField,
      {
        name: "phoneNumber",
        title: "Phone Number",
        inputType: FieldType.PHONE_NUMBER,
      },
      {
        name: "password",
        title: "Set Password",
        inputType: FieldType.PASSWORD,
      },
      {
        name: "password2",
        title: "Confirm Password",
        inputType: FieldType.PASSWORD,
      },
    ] as FormField[],
  };
  const { mutate, isPending } = useCreate<RegisterResponse>("v2/auth/register");
  const onSubmit = (data: RegisterFormData) => {
    const splitName = data.fullname.split(" ");
    const formData = {
      firstName: splitName[0],
      lastName: splitName.length > 1 ? splitName[1] : splitName[0],
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
      confirmPassword: data.password2,
      country: data.country,
      role: "user",
    };

    try {
      mutate(formData, {
        onSuccess: async (res) => {
          console.log("Response", res);
          setRegister({
            email: data.email,
            fullname: data.fullname,
            phoneNumber: data.phoneNumber,
            token: "",
          });
          Toast.show({
            type: "success",
            text1: "Registered",
            text2: res.data.message ?? res.message,
          });
          // await setToken(res.data.token);
          // replace("/events");
          push({
            pathname: "/auth/verify",
            params: {
              parent: "register",
              email: data.email,
              name: data.fullname,
            },
          } as any);
        },
        onError: (error) => {
          Toast.show({ type: "error", text1: "Error", text2: error.message });
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
            Register
          </Text>
        </AnimatedView>
        <AnimatedView variant="fade">
          <Text className="text-3xs text-typography-subtle">
            Create an account to continue!
          </Text>
        </AnimatedView>
        <AnimatedView variant="fade" className="mt-4">
          <AppForm form={form} />
        </AnimatedView>
        <VStack space={"md"}>
          <AnimatedView variant="fade">
            <AppBtn
              loading={isPending}
              loadingText="Proccessing..."
              title="Register"
              onPress={handleSubmit(onSubmit)}
            />
          </AnimatedView>
          <Box className="mt-10 text-center">
            <AnimatedView variant="slideY" direction="bottom">
              <Text className="text-center">
                Already have an account?
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

export default RegisterScreen;
