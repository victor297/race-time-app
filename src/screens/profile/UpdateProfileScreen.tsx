import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppBar } from "~/components";
import { AnimatedView, AppForm } from "~/src/components";
import { useProfileStore } from "~/src/store";
import {
  FieldSelectOption,
  FieldType,
  FormField,
  toUserDto,
  UpdateProfileForm,
  UpdateProfileSchema,
  UpdateUserProfileResponse,
  UserDto,
} from "~/src/types";
import ProfilePhotoUpload from "./ProfilePhotoUpload";
import { useFetch, useUpdate } from "~/src/hooks";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { formatDateToYMD } from "~/src/utils";
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

const UpdateProfileScreen = () => {
  const profile = useProfileStore((s) => s.data);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UpdateProfileForm>({
    resolver: zodResolver(UpdateProfileSchema),
    values: {
      email: profile?.email ?? "",
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? "",
      phoneNumber: profile?.phoneNumber ?? "",
      dob: profile?.dob ?? "",
      gender: profile?.gender ?? "",
      club: profile?.club ?? "",
      city: profile?.city ?? "",
      country: profile?.country ?? "",
      contactPerson: profile?.contactPerson ?? "",
      contactPersonPhoneNumber: profile?.contactPersonPhoneNumber ?? "",
      bio: profile?.bio ?? "",
    },
  });
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
        name: "email",
        title: "Email",
        inputType: FieldType.EMAIL,
        required: true,
        autoComplete: "email",
        autoCapitalize: "none",
        isDisabled: false,
        readOnly: true,
      } as FormField,
      {
        name: "phoneNumber",
        title: "Phone Number",
        inputType: FieldType.PHONE_NUMBER,
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
        name: "club",
        title: "Organization/Club",
        inputType: FieldType.NAME,
        autoCapitalize: "none",
      } as FormField,

      {
        name: "contactPerson",
        title: "Emergency Contact Person",
        inputType: FieldType.FULLNAME,
        autoComplete: "name",
      } as FormField,
      {
        name: "contactPersonPhoneNumber",
        title: "Emergency Contact Number",
        inputType: FieldType.PHONE_NUMBER,
      } as FormField,

      {
        name: "bio",
        title: "About me",
        inputType: FieldType.MULTILINE,
        autoComplete: "off",
        autoCapitalize: "none",
      } as FormField,
    ],
  };
  React.useEffect(() => {
    console.log("profile", profile);
    if (profile) {
      setValue("firstName", profile.firstName);
      setValue("lastName", profile.lastName);
      setValue(
        "phoneNumber",
        String(profile.phoneNumber ?? "").replace("+234", "0")
      );
      setValue("email", profile.email);
      setValue("gender", profile.gender ?? "");
      setValue("dob", profile.dob ? formatDateToYMD(profile.dob) : "");
      setValue("club", profile.club ?? "");
      setValue("city", profile.city ?? "");
      setValue("country", profile.country ?? "");
      setValue("contactPerson", profile.contactPerson ?? "");
      setValue(
        "contactPersonPhoneNumber",
        profile.contactPersonPhoneNumber ?? ""
      );
      setValue("bio", profile.bio ?? "");
    }
  }, [profile]);
  const { mutate, isPending } = useUpdate<UpdateUserProfileResponse>(
    "users/profile",
    "user_profile_info-with-stats"
  );
  const onSubmit = (data: UpdateProfileForm) => {
    try {
      const { email, ...payload } = data;
      mutate(payload, {
        onSuccess: async (res) => {
          Toast.show({
            type: "success",
            text1: "Updated",
            text2: res.data.message ?? res.message,
          });
          refetchProfile();
          router.back();
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
      Toast.show({ text2: err.message, type: "error", text1: "Error!" });
    }
  };
  const {
    data,
    isLoading,
    error,
    refetch: refetchProfile,
  } = useFetch<UserDto>("user_profile", "users/profile", { enabled: false });
  const { setProfile } = useProfileStore();
  useEffect(() => {
    if (!isLoading && data?.data && !error) {
      setProfile(toUserDto(data.data));
    }
  }, [data, isLoading]);
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="flex-1 bg-white">
        <AppBar
          onSave={handleSubmit(onSubmit)}
          title="Edit profile"
          showSave
          saveText="SAVE"
          savingLoading={isPending}
        />
        <View className="flex-1 bg-[#F1F1F3]">
          <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 8,
              paddingTop: 20,
              paddingBottom: 140,
            }}
            enableOnAndroid={true}
            extraScrollHeight={20}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 bg-white py-8 rounded-2xl px-5">
              <ProfilePhotoUpload
                profileUri={profile?.profileUri}
                fullname={profile?.fullName}
              />
              <AnimatedView variant="fade" className="mt-4">
                <AppForm form={form} />
              </AnimatedView>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default UpdateProfileScreen;
