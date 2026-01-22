import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { useFetch } from "~/src/hooks";
import {
  CombinedForm,
  DeliveryAreasDropdown,
  DeliveryAreasDropdownResponse,
  EventCategoryDto,
  EventDto,
  EventPackageDto,
  EventStep2Form,
  EventStep2Schema,
  FieldType,
  FormField,
} from "~/src/types";
import EventFormAppBar from "./EventFormAppBar";
import FormButtonControl from "./FormButtonControl";
import { AnimatedView } from "../ui";
import { AppForm } from "../form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type RegisterFormProps = {
  eventDetails: EventDto;
  setSelectedPackage: (selectedPackage?: EventPackageDto) => void;
  setSelectedDelivery: (selectedDelivery?: DeliveryAreasDropdown) => void;
  selectedPackage?: EventPackageDto;
  onContinue: (data: EventStep2Form) => void;
  onPrevious: () => void;
  onGoBack: () => void;
  formData?: CombinedForm;
  selectedCategory?: EventCategoryDto;
};
const RegisterFormTwo = ({
  eventDetails,
  setSelectedPackage,
  selectedPackage,
  onContinue,
  onGoBack,
  onPrevious,
  setSelectedDelivery,
  selectedCategory,
  formData,
}: RegisterFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<EventStep2Form>({
    resolver: zodResolver(EventStep2Schema),
    values: {
      package: formData?.package ?? "",
      shirtSize: formData?.shirtSize ?? "",
      deliveryArea: formData?.deliveryArea ?? "",
      address: formData?.address ?? "",
    },
  });
  const { data, refetch } = useFetch<DeliveryAreasDropdownResponse>(
    ["deliveryAreas", "dropdown"],
    "delivery-areas/dropdown",
    { enabled: false }
  );
  React.useEffect(() => {
    refetch();
  }, []);
  const sizeOptions = React.useMemo(() => {
    return {
      id: "value",
      label: "label",
      list:
        (selectedPackage?.includedItems ?? [])
          .find((x) => x.type == "Shirt" && Array.isArray(x.sizes))
          ?.sizes?.map((x) => ({
            value: x,
            label: x,
          })) ?? [],
      source: "default",
    };
  }, [selectedPackage, eventDetails.packages]);

  const packageOptions = React.useMemo(() => {
    return {
      id: "value",
      label: "label",
      list: (eventDetails?.packages ?? []).map((x: EventPackageDto) => ({
        value: x._id,
        label: `${x.name}`,
      })),
      source: "default",
    };
  }, [eventDetails]);
  const cityOptions = React.useMemo(() => {
    return {
      id: "value",
      label: "label",
      list: (data?.data?.data ?? []).map((x: DeliveryAreasDropdown) => ({
        value: x.id,
        label: `${x.name}`,
      })),
      source: "default",
    };
  }, [data?.data.data]);
  const form = {
    control: control,
    errors: errors,
    field: [
      {
        name: "package",
        title: "Select You Package",
        inputType: FieldType.SELECT,
        option: packageOptions,
        required: true,
      } as FormField,
      {
        name: "shirtSize",
        title: "Shirt Size (optional)",
        inputType: FieldType.SELECT,
        option: sizeOptions,
        // required: true,
      } as FormField,
      {
        name: "deliveryArea",
        title: "Delivery Area",
        inputType: FieldType.SELECT,
        option: cityOptions,
        required: false,
      } as FormField,
      {
        name: "address",
        title: "Delivery Address",
        inputType: FieldType.FIELD,
        required: true,
      } as FormField,
    ],
  };
  const watchedPackage = watch("package");
  const watchedDeliveryArea = watch("deliveryArea");

  React.useEffect(() => {
    if (watchedPackage && eventDetails?.packages) {
      const found = eventDetails.packages.find(
        (pkg) => pkg._id === watchedPackage
      );
      console.log(found);
      setSelectedPackage(found);
    }
  }, [watchedPackage, eventDetails?.packages]);
  React.useEffect(() => {
    if (watchedDeliveryArea && data?.data.data) {
      const found = data?.data.data.find(
        (pkg) => pkg.id === watchedDeliveryArea
      );
      console.log(found);
      setSelectedDelivery(found);
    }
  }, [watchedDeliveryArea, data?.data.data]);
  React.useEffect(() => {
    setValue("package", formData?.package ?? "");
    setValue("shirtSize", formData?.shirtSize ?? "");
    setValue("deliveryArea", formData?.deliveryArea ?? "");
    setValue("address", formData?.address ?? "");
  }, [formData]);
  const onSubmit = (data: EventStep2Form) => {
    console.log("✅ Submitted data:", data);
    onContinue(data);
  };
  return (
    <>
      <EventFormAppBar
        onGoBack={onGoBack}
        onPrevious={onPrevious}
        onPress={handleSubmit(onSubmit)}
        currentStep={2}
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
            {"Include steps (Package)"}
          </Text>
        </View>
        <AnimatedView variant="fade" className="mt-4">
          <AppForm form={form} />
        </AnimatedView>
      </KeyboardAwareScrollView>
      <FormButtonControl
        steps={
          selectedPackage?.isFree == true && selectedCategory?.isFree === true
            ? 3
            : !selectedPackage
              ? 3
              : 4
        }
        currentStep={2}
        onPress={handleSubmit(onSubmit)}
      />
    </>
  );
};

export default RegisterFormTwo;
