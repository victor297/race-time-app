import React from "react";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "~/components/ui/form-control";
import { Controller } from "react-hook-form";
import { Box } from "~/components/ui/box";
import { StyleSheet, Text } from "react-native";
import AnimatedView from "./animatedView";
import PhoneInput from "@linhnguyen96114/react-native-phone-input";
type Props = {
  control: any;
  name: string;
  title: string;
  required?: boolean;
  placeholder?: string;
  errors?: string;
  isInvalid?: boolean;
  size?:
    | "full"
    | "sm"
    | "6"
    | "2xs"
    | "2"
    | "8"
    | "xs"
    | "3"
    | "12"
    | "md"
    | "4"
    | "16"
    | "xl"
    | "5"
    | "24"
    | "32"
    | "7"
    | "0.5"
    | "lg"
    | "1"
    | "2xl"
    | "2.5"
    | "1.5"
    | "10"
    | "20"
    | "64";
  inputRef?: any;
  isFocused?: boolean;
  setFocus?: any;
  isDisabled?: boolean;
};
function AppPhoneNumber(props: Props) {
  const {
    control,
    name,
    title,
    errors,
    isDisabled,
    isFocused,
    isInvalid,
    placeholder,
    required,
    setFocus,
    size = "full",
  } = props;
  return (
    <FormControl
      isInvalid={isInvalid}
      size={size}
      isDisabled={isDisabled}
      isReadOnly={true}
      isRequired={required}
      className="mb-4 flex-col"
    >
      {title && (
        <FormControlLabel>
          <FormControlLabelText
            className="font-medium"
            style={{ color: "#6C7278", fontSize: 12 }}
          >
            {title}
          </FormControlLabelText>
        </FormControlLabel>
      )}

      <Controller
        control={control}
        rules={{
          required: required,
        }}
        render={({ field: { onChange, onBlur, value } }) => {
          return (
            <React.Fragment>
              <PhoneInput
                defaultValue={value}
                defaultCode="NG"
                onChangeText={onChange}
                placeholder={placeholder}
                autoFocus={isFocused}
                disabled={isDisabled}
                onFocus={setFocus}
                value={value}
                containerStyle={{
                  width: "100%",
                  borderRadius: 10,
                  backgroundColor: "#fff",
                  borderColor: isInvalid ? "#ef4444" : "#EDF1F3",
                  borderWidth: 1,
                  // shadowColor: "#000",
                  // shadowOffset: { width: 0, height: 2 },
                  // shadowOpacity: 0.1,
                  // shadowRadius: 3,
                  // elevation: 3,
                }}
                textContainerStyle={{
                  borderRadius: 10,
                  backgroundColor: "#fff",
                  paddingHorizontal: 14,
                }}
              />
            </React.Fragment>
          );
        }}
        name={name}
      />
      {isInvalid && (
        <AnimatedView
          variant="scaleY"
          direction="bottom"
          duration={800}
          delay={100}
        >
          <Box className="flex justify-start">
            <Text className="text-red-500">{errors}</Text>
          </Box>
        </AnimatedView>
      )}
    </FormControl>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
});
export default AppPhoneNumber;
