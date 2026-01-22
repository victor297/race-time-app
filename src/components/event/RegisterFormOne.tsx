import { zodResolver } from "@hookform/resolvers/zod";
import React, { forwardRef } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import {
  CombinedForm,
  EventCategoryDto,
  EventDto,
  EventStep1Form,
  EventStep1Schema,
  FieldSelectOption,
  FieldType,
  FormField,
  UserDto,
} from "~/src/types";
import { AnimatedView } from "../ui";
import { AppForm } from "../form";
import FormButtonControl from "./FormButtonControl";
import EventFormAppBar from "./EventFormAppBar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { formatDateToYMD } from "~/src/utils";
import { set } from "date-fns";
export type RegisterFormOneRef = {
  submitForm: () => void;
};
type RegisterFormProps = {
  eventDetails: EventDto;
  profile: UserDto | null;
  formData?: CombinedForm;
  onContinue: (data: EventStep1Form) => void;
  setSelectedCategory: (selectedCategory?: EventCategoryDto) => void;
  onPrevious: () => void;
  onGoBack: () => void;
  isFree?: boolean;
};
const countryOptions: FieldSelectOption = {
  id: "id",
  label: "name",
  list: [],
  source: "country",
};
const genderOptions: FieldSelectOption = {
  id: "id",
  label: "name",
  list: [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ],
  source: "default",
};

const RegisterFormOne = forwardRef<RegisterFormOneRef, RegisterFormProps>(
  (
    {
      eventDetails,
      profile,
      onContinue,
      setSelectedCategory,
      onGoBack,
      onPrevious,
      formData,
      isFree,
    },
    ref
  ) => {
    const {
      control,
      handleSubmit,
      formState: { errors },
      setValue,
      watch,
    } = useForm<EventStep1Form>({
      resolver: zodResolver(EventStep1Schema),
      values: {
        email: "",
        firstName: "",
        lastName: "",
        nameOnBib: "",
        phoneNumber: "",
        dob: "",
        gender: "",
        club: "",
        city: "",
        country: "Nigeria",
        contactPerson: "",
        contactPersonPhoneNumber: "",
        // bibNo: "",
        category: "",
      },
    });

    const categoriesOptions = React.useMemo(() => {
      return {
        id: "value",
        label: "label",
        list: (eventDetails?.categories ?? []).map((x: EventCategoryDto) => ({
          value: x._id,
          label: `${x.title}`,
        })),
        source: "default",
      };
    }, [eventDetails]);

    const form = {
      control: control,
      errors: errors,
      field: [
        {
          name: "firstName",
          title: "First Name",
          inputType: FieldType.NAME,
          required: true,
          autoComplete: "name-given",
        } as FormField,
        {
          name: "lastName",
          title: "Last Name",
          inputType: FieldType.NAME,
          required: true,
          autoComplete: "name-family",
        } as FormField,
        {
          name: "nameOnBib",
          title: "Name on Bib",
          inputType: FieldType.FULLNAME,
          required: true,
          autoComplete: "off",
          autoCapitalize: "none",
        } as FormField,
        // {
        //   name: "bibNo",
        //   title: "Bib number",
        //   inputType: FieldType.FIELD,
        //   required: false,
        //   autoComplete: "off",
        // } as FormField,
        {
          name: "email",
          title: "Email",
          inputType: FieldType.EMAIL,
          required: true,
          autoComplete: "email",
          autoCapitalize: "none",
        } as FormField,
        {
          name: "phoneNumber",
          title: "Phone Number",
          inputType: FieldType.PHONE_NUMBER,
          required: true,
        } as FormField,
        [
          {
            name: "dob",
            title: "Date Of Birth",
            inputType: FieldType.DATE,
            required: true,
            maxDate: new Date(
              new Date().getFullYear() - 18,
              new Date().getMonth(),
              new Date().getDate()
            ),
            minDate: new Date(1960, 0, 1),
          } as FormField,
          {
            name: "gender",
            title: "Gender",
            inputType: FieldType.SELECT,
            option: genderOptions,
            required: true,
          } as FormField,
        ],
        {
          name: "club",
          title: "Organization/Club",
          inputType: FieldType.NAME,
          required: true,
          autoCapitalize: "none",
        } as FormField,
        {
          name: "category",
          title: "Select category",
          inputType: FieldType.SELECT,
          option: categoriesOptions,
          required: true,
        } as FormField,
        {
          name: "city",
          title: "City",
          inputType: FieldType.NAME,
          required: true,
          autoComplete: "postal-address-region",
        } as FormField,
        {
          name: "country",
          title: "Country",
          inputType: FieldType.SELECT,
          option: countryOptions,
          required: true,
        } as FormField,
        {
          name: "contactPerson",
          title: "Emergency Contact Person",
          inputType: FieldType.FULLNAME,
          required: true,
          autoComplete: "name",
        } as FormField,
        {
          name: "contactPersonPhoneNumber",
          title: "Emergency Contact Number",
          inputType: FieldType.PHONE_NUMBER,
          required: true,
        } as FormField,
      ],
    };
    const watchedCategory = watch("category");
    React.useEffect(() => {
      if (watchedCategory && eventDetails?.categories) {
        const found = eventDetails.categories.find(
          (cat) => cat._id === watchedCategory
        );
        console.log(found);
        setSelectedCategory(found);
      }
    }, [watchedCategory, eventDetails?.categories]);
    React.useEffect(() => {
      console.log("profile", profile);
      if (profile) {
        setValue("firstName", formData?.firstName ?? profile.firstName);
        setValue("lastName", formData?.lastName ?? profile.lastName);
        setValue(
          "phoneNumber",
          String(formData?.phoneNumber ?? profile.phoneNumber ?? "").replace(
            "+234",
            "0"
          )
        );
        setValue("nameOnBib", formData?.nameOnBib ?? "");
        setValue("category", formData?.category ?? "");
        setValue("email", formData?.email ?? profile.email);
        setValue("gender", formData?.gender ?? profile.gender ?? "");
        setValue(
          "dob",
          formData?.dob
            ? formatDateToYMD(formData.dob)
            : profile.dob
              ? formatDateToYMD(profile.dob)
              : ""
        );
        setValue("club", formData?.club ?? profile.club ?? "");
        setValue("city", formData?.city ?? profile.city ?? "");
        setValue("country", formData?.country ?? profile.country ?? "");
        setValue(
          "contactPerson",
          formData?.contactPerson ?? profile.contactPerson ?? ""
        );
        setValue(
          "contactPersonPhoneNumber",
          String(
            formData?.contactPersonPhoneNumber ??
              profile.contactPersonPhoneNumber ??
              ""
          ).replace("+234", "0")
        );
      }
    }, [formData, profile]);

    const onSubmit = (data: EventStep1Form) => {
      console.log("✅ Submitted data:", data);
      onContinue(data);
    };
    return (
      <>
        <EventFormAppBar
          onGoBack={onGoBack}
          onPrevious={onPrevious}
          onPress={handleSubmit(onSubmit)}
          currentStep={1}
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
              Include steps (Personal Information)
            </Text>
          </View>
          <AnimatedView variant="fade" className="mt-4">
            <AppForm form={form} />
          </AnimatedView>
        </KeyboardAwareScrollView>
        <FormButtonControl
          currentStep={1}
          onPress={handleSubmit(onSubmit)}
          isFree={isFree}
          steps={3}
        />
      </>
    );
  }
);

export default RegisterFormOne;
