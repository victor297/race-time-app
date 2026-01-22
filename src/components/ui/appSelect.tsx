import React, { useCallback, useMemo, useRef } from "react";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "~/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "~/components/ui/input";
import { Controller } from "react-hook-form";
import clsx from "clsx";
import { Box } from "~/components/ui/box";
import { Keyboard, Pressable, StyleSheet, Text, View } from "react-native";
import AnimatedView from "./animatedView";
import { ChevronDownIcon, Icon } from "~/components/ui/icon";
import CountryPicker from "react-native-country-picker-modal";
import { HStack } from "~/components/ui/hstack";
import { Dropdown } from "react-native-element-dropdown";
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
  p?: number;
  inputRef?: any;
  matchField?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  className?: string;
  option?: {
    id: string;
    label: string;
    list: any[];
    source: "custom" | "country" | "default";
  };
};
function AppSelect(props: Props) {
  const {
    control,
    name,
    title,
    className,
    errors,
    inputRef,
    isDisabled,
    isInvalid,
    p,
    placeholder,
    required,
    size = "full",
    option,
  } = props;
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const handleClose = () => {
    setIsOpen(false);
  };
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
          const onSelect = (data: any) => {
            if (data["name"]) {
              onChange(data["name"]);
            }
          };
          return (
            <React.Fragment>
              {option?.source == "default" && (
                <Dropdown
                  style={{
                    ...styles.dropdown,
                    borderColor: isInvalid ? "#ef4444" : "#EDF1F3",
                  }}
                  placeholderStyle={styles.placeholder}
                  selectedTextStyle={styles.selectedText}
                  data={option.list ?? []}
                  labelField="label"
                  valueField="value"
                  placeholder={placeholder}
                  value={value}
                  onChange={(item) => onChange(item.value)}
                />
              )}
              {option?.source == "custom" && (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    console.log("Click me");
                    Keyboard.dismiss();
                    setIsOpen(true);
                  }}
                >
                  <Input
                    pointerEvents="none"
                    className={clsx(
                      "h-[46px] text-secondary-500 rounded-[10px] border border-[#EDF1F3]",
                      className,
                      p
                    )}
                    size={"md"}
                    isDisabled={isDisabled}
                    isInvalid={isInvalid}
                    isRequired={required}
                    variant={"outline"}
                  >
                    <InputField
                      placeholder={placeholder}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      ref={inputRef}
                      readOnly={true}
                    />
                    <InputSlot className="pr-2">
                      <InputIcon size={"md"} as={ChevronDownIcon} />
                    </InputSlot>
                  </Input>
                </Pressable>
              )}
              {option?.source == "country" && (
                <HStack
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    backgroundColor: "#fff",
                    borderColor: isInvalid ? "#ef4444" : "#EDF1F3",
                    borderWidth: 1,
                    height: 46,
                    paddingHorizontal: 14,
                    flex: 1,
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ width: "96%" }}>
                    <CountryPicker
                      {...{
                        countryCode: "NG",
                        withFilter: true,
                        withFlag: true,
                        withCountryNameButton: true,
                        withAlphaFilter: true,
                        onSelect,
                      }}
                      visible={isOpen}
                    />
                  </View>
                  <View style={{ width: 24, height: 24 }}>
                    <Icon
                      size={"md"}
                      as={ChevronDownIcon}
                      className="text-typography-subtle"
                    />
                  </View>
                </HStack>
              )}
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
  dropdown: {
    height: 50,
    borderColor: "#EDF1F3",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  placeholder: { color: "#6C7278" },
  selectedText: { color: "#1A1C1E" },
});
export default AppSelect;
