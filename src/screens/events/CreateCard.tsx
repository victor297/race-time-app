import { FontAwesome6 } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AnimatedView, AppBtn, AppForm } from "~/src/components";
import AppImages from "~/src/configs/AppImages";
import {
  FieldType,
  FormField,
  FormProps,
  PaymentCardFormData,
  PaymentCardSchema,
} from "~/src/types";

function CreateCardScreen() {
  const {
    control: control,
    handleSubmit: handleSubmit,
    formState: { errors: errors },
  } = useForm<PaymentCardFormData>({
    resolver: zodResolver(PaymentCardSchema),
    values: {
      name: "",
      card: "",
      cvv: "",
      expired: "",
    },
  });
  const onSubmit = (data: PaymentCardFormData) => {
    router.back();
  };
  const form: FormProps<PaymentCardFormData> = {
    control: control,
    errors: errors,
    field: [
      {
        name: "name",
        title: "Name on card",
        inputType: FieldType.FIELD,
        required: true,
      } as FormField,
      {
        name: "card",
        title: "Card number",
        inputType: FieldType.FIELD,
        required: true,
      } as FormField,
      [
        {
          name: "cvv",
          title: "CVV",
          inputType: FieldType.FIELD,
          required: true,
        } as FormField,
        {
          name: "expired",
          title: "Expiry",
          inputType: FieldType.FIELD,
          required: true,
        } as FormField,
      ],
    ],
  };
  return (
    <View className="flex-1">
      <SafeAreaView className="flex-1 bg-primary">
        <View className="flex-1 bg-white">
          <StatusBar barStyle="light-content" />
          <View className="bg-white p-3 px-5 py-5 flex-row items-center justify-between shadow-black shadow-lg">
            <View className="flex flex-row justify-start items-center gap-4">
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
              >
                <FontAwesome6 name="arrow-left" size={24} color="black" />
              </TouchableOpacity>
              <Text className="text-black/75 font-bold text-[16px]">
                Cancel
              </Text>
            </View>
            <View className="w-32">
              <AppBtn
                onPress={handleSubmit(onSubmit)}
                variant="default"
                className="bg-transparent"
              >
                <Text className="text-black/75 font-bold text-[14px]">
                  Save Details
                </Text>
              </AppBtn>
            </View>
          </View>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 140 }}
            className="px-5"
          >
            <Image
              source={AppImages.payment}
              style={{ width: 48, height: 48, marginBottom: 10, marginTop: 20 }}
              className="my-5"
            />

            <Text className="text-[18px] font-[600] text-gray-800 mb-1">
              Change your details
            </Text>
            <Text className="text-sm text-gray-500 mb-5">
              Update your payment details.
            </Text>
            <AnimatedView variant="fade" className="mt-4">
              <AppForm form={form} />
            </AnimatedView>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default CreateCardScreen;
