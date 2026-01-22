import { Text, View } from "react-native";
import {
  DeliveryAreasDropdown,
  EventCategoryDto,
  EventDto,
  EventPackageDto,
  EventRegistrationDto,
  EventStep1Form,
  EventStep2Form,
  PaymentDataItemsProps,
  PaymentDataProps,
  RegisterForEventResponse,
} from "~/src/types";
import { formatMoney } from "~/src/utils";
import EventFormAppBar from "./EventFormAppBar";
import { AnimatedView } from "../ui";
import FormButtonControl from "./FormButtonControl";
import { useCreate } from "~/src/hooks";
import { useLoading } from "~/src/context";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { router } from "expo-router";
type CombinedForm = EventStep1Form & EventStep2Form;
type CheckoutSummaryProps = {
  event: EventDto;
  selectedCategory?: EventCategoryDto;
  selectedPackage?: EventPackageDto;
  selectedDeliveryArea?: DeliveryAreasDropdown;
  data: CombinedForm;
  onContinue: (data: PaymentDataProps) => void;
  onPrevious: () => void;
  onGoBack: () => void;
};

function RegisterCheckoutSummary({
  event,
  selectedCategory,
  selectedPackage,
  selectedDeliveryArea,
  data,
  onContinue,
  onGoBack,
  onPrevious,
}: CheckoutSummaryProps) {
  const { showLoading, hideLoading } = useLoading();
  const packages = selectedPackage?.includedItems
    ?.map((x) => x.label)
    .join(" + ");
  const total =
    Number(selectedPackage?.price) +
    Number(event.pricingMode == "category" ? selectedCategory?.price : 0) +
    Number(selectedDeliveryArea?.fee ?? 0);
  const { mutate, isPending } =
    useCreate<RegisterForEventResponse>("v2/events/register");
  const onProceed = async () => {
    console.log("Previous data:", data);
    const dto = EventRegistrationDto.fromJson(data, event.id);
    if (dto && event.id) {
      console.log("DTO:", dto);
      showLoading();
      const items = await getPaymentItems();
      mutate(
        {
          ...dto,
          paymentAmount: total,
          paidItems: items,
        },
        {
          onSuccess: async (res) => {
            console.log("Response", res);
            if (res.data.data.id) {
              Toast.show({
                type: "success",
                text1: "Saved",
                text2: "Saved procced to payment",
              });
              const paymentData: PaymentDataProps = {
                total: total,
                items: items,
                registrationId: res.data.data.id,
              };
              hideLoading();
              if (!selectedCategory?.isFree || !selectedPackage?.isFree) {
                Toast.show({
                  type: "success",
                  text1: "Saved",
                  text2: "Saved procced to payment",
                });
                onContinue(paymentData);
              } else {
                Toast.show({
                  type: "success",
                  text1: "Saved",
                  text2: "Registration completed successfully",
                });
                router.back();
              }
            } else {
              Toast.show({
                type: "error",
                text1: "Error!",
                text2: "An error occurred please try again",
              });
            }
          },
          onError: (error) => {
            Toast.show({ type: "error", text1: "Error", text2: error.message });
            hideLoading();
          },
        }
      );
    }
  };
  const getPaymentItems = async () => {
    const items: PaymentDataItemsProps[] = [
      {
        name: packages ?? "",
        amount: selectedCategory?.price ?? 0,
      },
      {
        name: "Delivery",
        amount: selectedDeliveryArea?.fee ?? 0,
      },
    ];
    if (event.pricingMode == "category") {
      items.push({
        name: "Event",
        amount: selectedCategory?.price ?? 0,
      });
    }
    return items;
  };
  return (
    <>
      <EventFormAppBar
        onGoBack={onGoBack}
        onPrevious={onPrevious}
        onPress={onProceed}
        currentStep={3}
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
            {" Include steps (Payment Summary"}
          </Text>
        </View>
        <AnimatedView variant="fade" className="mt-4">
          <View
            className="bg-[#FFF9F8] rounded-2xl shadow-sm p-[16px] mb-8"
            style={{ elevation: 1 }}
          >
            <Text className="text-gray-700 text-lg font-semibold mb-3">
              Summary
            </Text>

            <View className="h-px bg-gray-200 mb-4" />

            {/* Rows */}
            <View className="space-y-3">
              <Row label="Event" value={event.eventTitle} />
              <Row label="Category" value={selectedCategory?.title ?? ""} />
              <Row
                label="Participant"
                value={`${data.lastName} ${data.firstName}`.trim()}
              />
              <Row
                label="Delivery Area"
                value={selectedDeliveryArea?.name ?? ""}
              />
              <Row label="Package" value={packages ?? ""} />
            </View>
          </View>

          {/* Payment Section */}
          {(!selectedCategory?.isFree || !selectedPackage?.isFree) && (
            <View>
              <Text className="text-gray-700 text-lg font-semibold mb-3">
                Payment
              </Text>
              <View className="h-px bg-gray-200 mb-4" />

              <View className="space-y-3 mb-6">
                {event.pricingMode == "category" && (
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-[14px] text-[#535862] font-[400]">
                      Event
                    </Text>
                    <Text
                      className={`text-sm text-[14px] text-[#414651] font-[500]"} `}
                    >
                      {formatMoney(selectedCategory?.price ?? 0)}
                    </Text>
                  </View>
                )}
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-[14px] text-[#535862] font-[400]">
                    {packages}
                  </Text>
                  <Text
                    className={`text-sm "text-[14px] text-[#414651] font-[500]"} `}
                  >
                    {formatMoney(selectedPackage?.price ?? 0)}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-[14px] text-[#535862] font-[400]">
                    Delivery
                  </Text>
                  <Text
                    className={`text-sm "text-[14px] text-[#414651] font-[500]"} `}
                  >
                    {formatMoney(selectedDeliveryArea?.fee ?? 0)}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center pt-4 border-t border-gray-200">
                <Text className="text-[16px] font-[600] text-black/75">
                  Total:
                </Text>
                <Text className="text-red-500 text-[16px] font-[600]">
                  {formatMoney(total)}
                </Text>
              </View>
            </View>
          )}
        </AnimatedView>
      </KeyboardAwareScrollView>
      <FormButtonControl
        loaing={isPending}
        currentStep={3}
        steps={selectedCategory?.isFree && selectedPackage?.isFree ? 3 : 4}
        isFree={selectedCategory?.isFree && selectedPackage?.isFree}
        onPress={onProceed}
      />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between items-center mb-2">
      <Text className="text-[14px] text-[#535862] font-[400]">{label}</Text>
      <Text className="text-[14px] text-[#414651] font-[500]">{value}</Text>
    </View>
  );
}

export default RegisterCheckoutSummary;
