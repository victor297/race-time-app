import { zodResolver } from "@hookform/resolvers/zod";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { useForm } from "react-hook-form";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { AppBar } from "~/components";
import { AnimatedView, AppForm } from "~/src/components";
import { FieldType, FormField } from "~/src/types";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

const CertificateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  bib: z.string().min(1, "Bib number is required"),
  eventName: z.string().min(1, "Event name is required"),
  eventLocation: z.string().min(1, "Event location is required"),
});

type CertificateForm = z.infer<typeof CertificateSchema>;

const CertificateScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CertificateForm>({
    resolver: zodResolver(CertificateSchema),
    defaultValues: {
      firstName: "Richard",
      lastName: "Salano",
      bib: "TB-010273",
      eventName: "Trail Blazers Dusk Till Dawn",
      eventLocation: "Abuja Nigeria",
    },
  });

  // Mock event data
  const eventData = {
    title: "Trail Blazers Dusk Till Dawn",
    imageUrl: "",
    location: "Abuja, Nigeria",
    date: "2025-10-01",
  };

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
        name: "bib",
        title: "Bib",
        inputType: FieldType.FIELD,
        required: true,
      } as FormField,
      {
        name: "eventName",
        title: "Event Name",
        inputType: FieldType.FIELD,
        required: true,
      } as FormField,
      {
        name: "eventName",
        title: "Event Name",
        inputType: FieldType.FIELD,
        required: true,
      } as FormField,
      {
        name: "eventLocation",
        title: "Event Location",
        inputType: FieldType.FIELD,
        required: true,
      } as FormField,
    ],
  };

  const onSubmit = (data: CertificateForm) => {
    try {
      console.log("Certificate data:", data);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Certificate generated successfully",
      });
      router.back();
    } catch (err: any) {
      Toast.show({
        text2: err.message,
        type: "error",
        text1: "Error!",
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="flex-1 bg-white">
        <AppBar
          onSave={handleSubmit(onSubmit)}
          title="Certificate"
          showSave
          saveText="SAVE"
        />

        <View className="flex-1 bg-[#F1F1F3]">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              paddingHorizontal: 8,
              paddingTop: 20,
              paddingBottom: 140,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 bg-white py-8 rounded-2xl px-5">
              {/* Event Header */}
              <AnimatedView variant="scale" className="mb-6">
                <View className="flex-row items-center">
                  {/* Event Badge */}
                  <View className="w-20 h-20 rounded-full bg-blue-500 items-center justify-center mr-4">
                    {eventData.imageUrl ? (
                      <Image
                        source={{ uri: eventData.imageUrl }}
                        contentFit="cover"
                        style={{ width: 80, height: 80, borderRadius: 40 }}
                      />
                    ) : (
                      <Feather name="award" size={40} color="white" />
                    )}
                  </View>

                  {/* Event Details */}
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900">
                      {eventData.title}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      {eventData.location}
                    </Text>
                    <Text className="text-sm text-gray-400 mt-0.5">
                      {eventData.date}
                    </Text>
                  </View>
                </View>
              </AnimatedView>

              {/* Divider */}
              <View className="h-px bg-gray-200 mb-6" />

              {/* Certificate Form */}
              <AnimatedView variant="fade">
                <AppForm form={form} />
              </AnimatedView>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CertificateScreen;
