import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import AppImages from "~/src/configs/AppImages";
import {
  PaymentCallbackResponse,
  PaymentDataProps,
  PaymentInitializeResponse,
  PaystackResponseDTO,
} from "~/src/types";
import { AnimatedView } from "../ui";
import EventFormAppBar from "./EventFormAppBar";
import FormButtonControl from "./FormButtonControl";
import Toast from "react-native-toast-message";
import { usePaystack } from "react-native-paystack-webview";
import { useCreate } from "~/src/hooks";
import { useLoading } from "~/src/context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
type Method = {
  id: string;
  brand?: "visa" | "mastercard" | "stripe" | "paystack" | "other";
  title: string;
  subtitle?: string;
  meta?: string;
  selected?: boolean;
  isNew?: boolean;
};

const ALWAYS_APPEND_METHODS: Method[] = [
  {
    id: "3",
    brand: "paystack",
    title: "Paystack payment method",
    isNew: true,
  },
  {
    id: "4",
    brand: "stripe",
    title: "Stripe payment method",
    isNew: true,
  },
];

type PaymentMethodsProps = {
  data?: PaymentDataProps;
  methods?: Method[];
  paymentCompleted: (amount: number) => void;
  onGoBack: () => void;
  fullname: string;
  email: string;
  eventTitle: string;
};

export default function PaymentMethods({
  methods = [],
  paymentCompleted,
  data,
  onGoBack,
  fullname,
  email,
  eventTitle,
}: PaymentMethodsProps) {
  const { popup } = usePaystack();
  const [items, setItems] = React.useState<Method[]>([]);
  const [selectMethod, setSelectMethod] = React.useState<Method>();
  const [isDark, setIsDark] = React.useState(true);
  const { showLoading, hideLoading } = useLoading();
  const [callbacUri, setCallbackUri] = React.useState<string>("");
  // Append Paystack + Stripe at the bottom always
  const { mutate, isPending } = useCreate<PaymentInitializeResponse>(
    "v2/events/paystack/initialize-payment"
  );
  const { mutate: mutateCallbac, isPending: loadingCallback } =
    useCreate<PaymentCallbackResponse>(callbacUri, ["my_joined_races"]);
  React.useEffect(() => {
    const combined = [...methods, ...ALWAYS_APPEND_METHODS];

    // Prevent infinite loop by checking if combined actually changed
    setItems((prev) => {
      const same =
        prev.length === combined.length &&
        prev.every((item, i) => item.id === combined[i].id);
      return same ? prev : combined;
    });
  }, [methods]);

  function select(id: string) {
    setItems((prev) =>
      prev.map((m) => ({
        ...m,
        selected: m.id === id,
      }))
    );

    const selected = items.find((m) => m.id === id);
    setSelectMethod(selected);
  }

  const payNow = (transactionReference: string) => {
    setIsDark(false);
    setTimeout(() => {
      console.log(transactionReference);
      popup.newTransaction({
        email: email ?? "jigbashio@gmail.com",
        amount: data?.total ?? 0,
        reference: transactionReference,
        metadata: {
          custom_fields: [
            {
              display_name: `Registration for ${eventTitle}`,
              variable_name: "event_registation_id",
              value: data?.registrationId,
            },
          ],
        },
        onSuccess: (res) => {
          const result: PaystackResponseDTO = PaystackResponseDTO.fromJson(res);
          showLoading();
          console.log(result);
          console.log(`match`, result.reference === transactionReference);
          completePayment();
        },
        onCancel: () => {
          Toast.show({
            type: "error",
            text1: "Payment failed",
            text2: "Payment cancelled!",
          });
          setIsDark(true);
        },
        onLoad: (res) => console.log("WebView Loaded:", res),
        onError: (err) => {
          console.log("Error", err);
          Toast.show({
            type: "error",
            text2: "An error occurred, please try again later!",
            text1: "Error!",
          });
          setIsDark(true);
        },
      });
    }, 200);
  };
  const completePayment = async () => {
    try {
      mutateCallbac(
        {},
        {
          onSuccess: async (res) => {
            console.log("Response", res);
            if (res.data.status == "success") {
              setIsDark(true);
              hideLoading();
              paymentCompleted(data?.total ?? 0);
            } else {
              hideLoading();
              Toast.show({
                type: "error",
                text1: "Error!",
                text2: res.message,
              });
            }
          },
          onError: (error) => {
            Toast.show({ type: "error", text1: "Error", text2: error.message });
            hideLoading();
          },
        }
      );
    } catch (error) {}
  };
  const onMakePayment = () => {
    console.log("Click me");

    if (!selectMethod) {
      Toast.show({
        text2: "Please select payment method to continue",
        type: "error",
        text1: "Error",
      });
    } else if (selectMethod?.brand == "paystack") {
      showLoading();
      mutate(
        {
          registrationId: data?.registrationId,
          amount: data?.total ?? 0,
        },
        {
          onSuccess: async (res) => {
            console.log("Response", res);
            if (res.data.data.reference) {
              setCallbackUri(
                `v2/events/paystack/payment/callback?reference=${res.data.data.reference}`
              );
              payNow(res.data.data.reference);
              hideLoading();
            } else {
              Toast.show({
                type: "error",
                text1: "Error!",
                text2: res.message,
              });
            }
          },
          onError: (error) => {
            Toast.show({ type: "error", text1: "Error", text2: error.message });
            hideLoading();
          },
        }
      );
    } else {
      Toast.show({
        text2: "Payment method current unavailable",
        type: "info",
        text1: "Unsupported",
      });
    }
  };
  const renderBrandIcon = (brand?: string) => {
    const sourceMap: Record<string, any> = {
      visa: AppImages.visa,
      mastercard: AppImages.mastercard,
      paystack: AppImages.paystack,
      stripe: AppImages.stripe,
    };
    const src = brand ? sourceMap[brand] : undefined;
    return src ? (
      <Image
        source={src}
        style={{ width: 46, height: 32 }}
        className="resize-contain"
      />
    ) : (
      <View className="w-[46px] h-[32px] bg-gray-200 rounded-md" />
    );
  };

  return (
    <>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <EventFormAppBar
        onGoBack={onGoBack}
        onPrevious={() => {}}
        onPress={onMakePayment}
        currentStep={4}
        title="Payment"
        showPrevious={false}
      />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 140 }}
        enableOnAndroid={true}
        extraScrollHeight={20}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center items-center flex-row mb-4 mt-2">
          <Text className="text-center text-typography text-[12px] font-[500]">
            Include steps (Payment Method)
          </Text>
        </View>

        <AnimatedView variant="fade" className="mt-4">
          <Image
            source={AppImages.payment}
            style={{ width: 48, height: 48, marginBottom: 10 }}
          />

          <Text className="text-[18px] font-[600] text-gray-800 mb-1">
            Pick your payment method
          </Text>
          <Text className="text-sm text-gray-500 mb-5">
            Pick payment details.
          </Text>

          <View className="space-y-4 gap-4">
            {items.map((m) => (
              <TouchableOpacity
                key={m.id + m.brand}
                activeOpacity={0.9}
                className={`flex-row items-center justify-between p-4 rounded-xl border ${
                  m.selected
                    ? "border-red-200 bg-red-50"
                    : "border-gray-200 bg-white"
                }`}
                onPress={() => select(m.id)}
              >
                {/* Left section */}
                <View className="flex-row items-center">
                  <View className="w-[46px] h-[32px] items-center justify-center mr-4">
                    {renderBrandIcon(m.brand)}
                  </View>

                  <View>
                    <Text className="text-[14px] text-gray-700 font-[500]">
                      {m.title}
                    </Text>
                    {m.subtitle && (
                      <Text className="text-[14px] text-gray-600 font-[400]">
                        {m.subtitle}
                      </Text>
                    )}

                    {m.meta && (
                      <View className="flex-row items-center mt-2">
                        <Text className="text-[14px] font-[500] text-gray-600 mr-3">
                          {m.meta}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            router.push({
                              pathname: "/modal/update-card",
                            })
                          }
                        >
                          <Text className="text-sm text-red-500 font-semibold">
                            Edit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>

                {/* Right section (Radio) */}
                <View className="items-center justify-center">
                  {m.selected ? (
                    <View className="w-6 h-6 rounded-full bg-red-600 items-center justify-center">
                      <View className="w-3 h-3 rounded-full bg-white" />
                    </View>
                  ) : (
                    <View className="w-5 h-5 rounded-full border border-gray-300" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </AnimatedView>
      </KeyboardAwareScrollView>

      <FormButtonControl
        loaing={isPending}
        currentStep={4}
        onPress={onMakePayment}
      />
    </>
  );
}

//  {
//     id: "1",
//     brand: "visa",
//     title: "Visa ending in 1234",
//     subtitle: "Expiry 06/2024",
//     meta: "Set as default",
//     selected: true,
//   },
//   {
//     id: "2",
//     brand: "mastercard",
//     title: "Mastercard ending in 1234",
//     subtitle: "Expiry 06/2024",
//     meta: "Set as default",
//   },
