import { Control, FieldErrors, FieldValues } from "react-hook-form";

export type FormProps<T extends FieldValues> = {
  control: Control<T>;
  errors: FieldErrors<T>;
  field: (FormField | FormField[])[];
};

export enum FieldType {
  NAME = "name",
  FULLNAME = "fullname",
  NUMBER = "number",
  PASSWORD = "password",
  PHONE_NUMBER = "phone_number",
  EMAIL = "email",
  SELECT = "select",
  MULTILINE = "textarea",
  DATE = "date",
  FIELD = "field",
}
export enum FieldValidator {
  NAME = "^[a-zA-Z]{2,}$",
  FULLNAME = "^[a-zA-Z]+(?: [a-zA-Z]+)+$",
  NUMBER = "^[0-9]+$",
  PASSWORD = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{8,}$",
  PHONE_NUMBER = "/^(080|091|090|070|081)+[0-9]{8}$/",
  EMAIL = "^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$",
  SELECT = ".*",
  MULTILINE = "[\\s\\S]*",
  FIELD = "^(?!.*<\\/?script.*>)[^<>]*$",
}

export type FormField = {
  name: string;
  title: string;
  placeHolder?: any;
  returnKeyType?: any;
  icon?: any;
  required?: boolean;
  keyboardType?: any;
  inputType?: FieldType;
  errors: any;
  ref?: any;
  onSubmitEditing?: any;
  list?: Array<any>;
  importantForAutofill?:
    | "auto"
    | "no"
    | "noExcludeDescendants"
    | "yes"
    | "yesExcludeDescendants";
  autoCapitalize?: "characters" | "words" | "sentences" | "none";
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
  readOnly?: boolean;
  watch?: {
    watch?: any;
    comparedMatch?: string;
    matchField?: string;
  };
  defaultValue?: any;
  className?: string;
  comparedMatch?: string;
  iconRignt?: any;
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
  isDisabled?: boolean;
  isReadOnly?: boolean;
  inputRef?: any;
  isFocused?: boolean;
  setFocus?: any;
  matchField?: string;
  p?: number;
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
  option?: FieldSelectOption;
  minDate?: Date;
  maxDate?: Date;
};

export type FieldSelectOption = {
  id: string;
  label: string;
  list: any[];
  source: "custom" | "country" | "default";
};
