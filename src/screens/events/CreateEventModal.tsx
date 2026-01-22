import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StatusBar, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  PaymentMethods,
  RegisterCheckoutSummary,
  RegisterFormOne,
  RegisterFormTwo,
} from "~/src/components";
import {
  CombinedForm,
  DeliveryAreasDropdown,
  EventCategoryDto,
  EventDto,
  EventPackageDto,
  EventRegistrationPaymentStatusDto,
  EventStep1Form,
  EventStep2Form,
  PaymentDataProps,
} from "~/src/types";
import { useProfileStore } from "~/src/store";
import { usePaystack } from "react-native-paystack-webview";

type Props = {};

const CreateEventModal = ({}: Props) => {
  const { popup } = usePaystack();
  const { initialStep = "1" } = useLocalSearchParams<{
    initialStep: string;
  }>();
  const [currentStep, setCurrentStep] = React.useState<number>(
    parseInt(initialStep)
  );
  const { event, status } = useLocalSearchParams();
  const eventDetails: EventDto = React.useMemo(() => {
    try {
      return JSON.parse(event as string);
    } catch {
      return null;
    }
  }, [event]);
  const paymentStatus: EventRegistrationPaymentStatusDto = React.useMemo(() => {
    try {
      return JSON.parse(status as string);
    } catch {
      return null;
    }
  }, [status]);
  const [formData, setFormData] = React.useState<CombinedForm>();
  const [paymentData, setPaymentData] = React.useState<PaymentDataProps>();
  const [selectedCategory, setSelectedCategory] =
    React.useState<EventCategoryDto>();
  const [selectedPackage, setSelectedPackage] =
    React.useState<EventPackageDto>();
  const [selectedDeliveryArea, setSelectedDelivery] =
    React.useState<DeliveryAreasDropdown>();
  const profile = useProfileStore((s) => s.data);
  React.useEffect(() => {
    if (paymentStatus && paymentStatus.status == "pending_payment") {
      setPaymentData({
        total: paymentStatus.paymentAmount || 0,
        items: paymentStatus.paidItems || [],
        registrationId: paymentStatus.registrationId || "",
      });
      setCurrentStep(4);
    }
  }, [paymentStatus]);
  return (
    <View className="flex-1 bg-white">
      <SafeAreaView
        className="flex-1 bg-primary"
        edges={["top", "left", "right"]}
      >
        <View className="flex-1 bg-white">
          <StatusBar barStyle="light-content" />
          {currentStep == 1 && eventDetails && profile && (
            <RegisterFormOne
              eventDetails={eventDetails}
              profile={profile}
              onContinue={(data: EventStep1Form) => {
                console.log("Received from child:", data);
                setFormData({ ...formData, ...data } as CombinedForm);
                setCurrentStep((prev) => prev + 1);
              }}
              setSelectedCategory={setSelectedCategory}
              onPrevious={() => setCurrentStep((prev) => prev - 1)}
              onGoBack={() => router.back()}
              formData={formData}
            />
          )}
          {currentStep == 2 && eventDetails && profile && (
            <RegisterFormTwo
              eventDetails={eventDetails}
              onContinue={(data: EventStep2Form) => {
                console.log("Received from child:", data);
                setFormData({ ...formData, ...data } as CombinedForm);
                setCurrentStep((prev) => prev + 1);
              }}
              setSelectedPackage={setSelectedPackage}
              selectedPackage={selectedPackage}
              onPrevious={() => setCurrentStep((prev) => prev - 1)}
              onGoBack={() => router.back()}
              setSelectedDelivery={setSelectedDelivery}
              selectedCategory={selectedCategory}
              formData={formData}
            />
          )}
          {currentStep == 3 && eventDetails && profile && (
            <RegisterCheckoutSummary
              event={eventDetails}
              onContinue={(data: PaymentDataProps) => {
                console.log("Received from child:", data);
                setPaymentData(data);
                setCurrentStep((prev) => prev + 1);
              }}
              selectedPackage={selectedPackage}
              onPrevious={() => setCurrentStep((prev) => prev - 1)}
              onGoBack={() => router.back()}
              data={formData as CombinedForm}
              selectedCategory={selectedCategory}
              selectedDeliveryArea={selectedDeliveryArea}
            />
          )}
          {currentStep == 4 &&
            eventDetails &&
            profile &&
            (!paymentStatus || paymentStatus.status != "pending_payment") && (
              <PaymentMethods
                paymentCompleted={(amount) => {
                  router.push({
                    pathname: "/modal/payment-success",
                    params: { amount: amount.toString() },
                  });
                }}
                onGoBack={() => router.back()}
                data={paymentData}
                fullname={`${formData?.firstName} ${formData?.lastName}`}
                email={formData?.email ?? ""}
                eventTitle={eventDetails.eventTitle ?? ""}
              />
            )}
          {currentStep == 4 &&
            eventDetails &&
            profile &&
            paymentStatus &&
            paymentStatus.status == "pending_payment" &&
            paymentData && (
              <PaymentMethods
                paymentCompleted={(amount) => {
                  router.push({
                    pathname: "/modal/payment-success",
                    params: { amount: amount.toString() },
                  });
                }}
                onGoBack={() => router.back()}
                data={paymentData}
                fullname={`${paymentStatus?.firstName} ${paymentStatus?.lastName}`}
                email={paymentStatus?.email ?? ""}
                eventTitle={eventDetails.eventTitle ?? ""}
              />
            )}
        </View>
      </SafeAreaView>
    </View>
  );
};
export default CreateEventModal;
