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
import { Keyboard, Platform, Pressable, Text } from "react-native";
import AnimatedView from "./animatedView";
import { CalendarDaysIcon, ChevronDownIcon } from "~/components/ui/icon";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  reverseDate,
  reverseTime,
  validateDate,
  validateTime,
} from "~/src/utils";
import { format } from "date-fns";
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
  type?: "date" | "time" | "datetime";
  minDate?: Date;
  maxDate?: Date;
};
function AppDate(props: Props) {
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
    minDate,
    maxDate,
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
          return (
            <React.Fragment>
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
                    onBlur={onBlur}
                    ref={inputRef}
                    readOnly={true}
                    value={value}
                  />
                  <InputSlot className="pr-2">
                    <InputIcon size={"md"} as={CalendarDaysIcon} />
                  </InputSlot>
                </Input>
              </Pressable>
              {isOpen && (
                <DateTimePicker
                  value={formartValue(value, props?.type)}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  minimumDate={minDate ?? new Date(2000, 0, 1)}
                  maximumDate={maxDate ?? new Date(2030, 11, 31)}
                  is24Hour={props?.type === "date" ? false : true}
                  onChange={(e, selectDate) => {
                    if (!props?.type || props.type === "date") {
                      onChange(format(selectDate as Date, "yyyy-MM-dd") as any);
                      handleClose();
                    }
                  }}
                  textColor="#FD2828"
                  accentColor="#FD2828"
                />
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

export default AppDate;
function formartValue(value?: any, type?: "date" | "time" | "datetime") {
  try {
    if (!value) return new Date();

    if (type === "time") return validateTime(value);
    if (type === "date" || !type) {
      const parsed = validateDate(value);
      return parsed instanceof Date && !isNaN(parsed.getTime())
        ? parsed
        : new Date();
    }
    return new Date();
  } catch (e) {
    return new Date();
  }
}
