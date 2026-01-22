import React from "react";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "~/components/ui/form-control";
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from "~/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "~/components/ui/input";
import { Controller } from "react-hook-form";
import clsx from "clsx";
import { Box } from "~/components/ui/box";
import { Text } from "react-native";
import AnimatedView from "./animatedView";
import { Textarea, TextareaInput } from "~/components/ui/textarea";
type Props = {
  control: any;
  name: string;
  title: string;
  type?: "text" | "password";
  required?: boolean;
  pattern?: any;
  placeholder?: string;
  returnKeyType?:
    | "done"
    | "go"
    | "next"
    | "search"
    | "send"
    | "none"
    | "previous"
    | "default"
    | "emergency-call"
    | "google"
    | "join"
    | "route"
    | "yahoo";
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "ascii-capable"
    | "numbers-and-punctuation"
    | "url"
    | "number-pad"
    | "name-phone-pad"
    | "decimal-pad"
    | "twitter"
    | "web-search"
    | "visible-password";
  icon?: any;
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
  iconSize?:
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
  autoComplete?:
    | "birthdate-day"
    | "birthdate-full"
    | "birthdate-month"
    | "birthdate-year"
    | "cc-csc"
    | "cc-exp"
    | "cc-exp-day"
    | "cc-exp-month"
    | "cc-exp-year"
    | "cc-number"
    | "email"
    | "gender"
    | "name"
    | "name-family"
    | "name-given"
    | "name-middle"
    | "name-middle-initial"
    | "name-prefix"
    | "name-suffix"
    | "password"
    | "password-new"
    | "postal-address"
    | "postal-address-country"
    | "postal-address-extended"
    | "postal-address-extended-postal-code"
    | "postal-address-locality"
    | "postal-address-region"
    | "postal-code"
    | "street-address"
    | "sms-otp"
    | "tel"
    | "tel-country-code"
    | "tel-national"
    | "tel-device"
    | "username"
    | "username-new"
    | "off";
  autoCapitalize?: "characters" | "words" | "sentences" | "none";
  iconRignt?: any;
  onSubmitEditing?: any;
  inputRef?: any;
  isFocused?: boolean;
  setFocus?: any;
  watch?: any;
  comparedMatch?: string;
  matchField?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  className?: string;
  importantForAutofill?:
    | "auto"
    | "no"
    | "noExcludeDescendants"
    | "yes"
    | "yesExcludeDescendants";
};
function AppTextArea(props: Props) {
  const {
    control,
    name,
    title,
    autoCapitalize,
    autoComplete,
    className,
    comparedMatch,
    errors,
    icon,
    iconRignt,
    iconSize,
    importantForAutofill,
    inputRef,
    isDisabled,
    isFocused,
    isInvalid,
    isReadOnly,
    keyboardType,
    matchField,
    onSubmitEditing,
    p,
    pattern,
    placeholder,
    required,
    returnKeyType,
    setFocus,
    size = "full",
    type,
    watch,
  } = props;
  const defaultPattern = /[\s\S]*/;
  const [showPassword, setShowPassword] = React.useState(false);
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };
  return (
    <FormControl
      isInvalid={isInvalid}
      size={size}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
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
          pattern: pattern ?? defaultPattern,
          validate: (val: string) => {
            if (watch && watch(matchField) != val) {
              return comparedMatch;
            }
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Textarea
            size={"md"}
            isReadOnly={isReadOnly}
            isInvalid={isInvalid}
            isDisabled={isDisabled}
            className={clsx(
              `h-[92px] text-secondary-500 rounded-[10px] border border-[#EDF1F3] ${isInvalid ? "border-error-500" : ""}`,
              className,
              p
            )}
            ref={inputRef}
            isFocused={isFocused}
            isRequired={required}
            variant={"outline"}
            onFocus={setFocus}
          >
            <TextareaInput
              placeholder={placeholder}
              value={value}
              onChangeText={onChange}
              returnKeyType={returnKeyType ?? "next"}
              keyboardType={keyboardType}
              importantForAutofill={
                importantForAutofill ?? "noExcludeDescendants"
              }
              onBlur={onBlur}
              autoComplete={autoComplete}
              onSubmitEditing={onSubmitEditing}
              autoCapitalize={autoCapitalize ?? "sentences"}
              ref={inputRef}
              readOnly={isReadOnly}
              secureTextEntry={type == "password" && !showPassword}
            />
          </Textarea>
        )}
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

export default AppTextArea;
