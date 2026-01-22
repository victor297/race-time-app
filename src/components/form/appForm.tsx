import React from "react";
import { FieldValues } from "react-hook-form";
import { FieldType, FieldValidator, FormProps } from "~/src/types";
import {
  AppDate,
  AppInput,
  AppPhoneNumber,
  AppSelect,
  AppTextArea,
} from "../ui";
import { View } from "react-native";

type Props<T extends FieldValues> = {
  form: FormProps<T>;
};

function AppForm<T extends FieldValues>({ form }: Props<T>) {
  const { control, errors, field } = form;
  return (
    <>
      {field.map((m, i) => {
        if (Array.isArray(m)) {
          return (
            <View
              key={`form_field_group_${i}`}
              style={{
                flex: 1,
                justifyContent: "space-between",
                width: "100%",
                flexDirection: "row",
              }}
            >
              {m.map((subField, j) => {
                console.log(subField.name);
                return (
                  <View
                    key={`form_field_sub_${i}_${j}`}
                    style={{ width: "48%" }}
                  >
                    <AppForm form={{ control, errors, field: [subField] }} />
                  </View>
                );
              })}
            </View>
          );
        }
        const errorMessage = errors?.[m.name as keyof typeof errors]
          ?.message as string | undefined;
        const isInvalid = errors?.[m.name as keyof typeof errors]
          ? true
          : false;
        const customMessage =
          errorMessage == "Invalid input"
            ? `${m.title} is required`
            : errorMessage;
        return (
          <React.Fragment key={`form_field_${i}`}>
            {m.inputType === FieldType.NAME && (
              <AppInput
                control={control}
                name={m.name}
                title={m.title}
                type="text"
                pattern={FieldValidator.NAME}
                autoCapitalize={m.autoCapitalize}
                autoComplete={m.autoComplete}
                className={m.className}
                comparedMatch={m.comparedMatch}
                watch={m.watch}
                errors={customMessage}
                icon={m.icon}
                iconRignt={m.iconRignt}
                iconSize={m.iconSize}
                importantForAutofill={m.importantForAutofill}
                inputRef={m.inputRef}
                isDisabled={m.isDisabled}
                isFocused={m.isFocused}
                isInvalid={isInvalid}
                isReadOnly={m.readOnly}
                keyboardType={m.keyboardType}
                matchField={m.matchField}
                onSubmitEditing={m.onSubmitEditing}
                p={m.p}
                placeholder={m.placeHolder}
                required={m.required}
                returnKeyType={m.returnKeyType}
                setFocus={m.setFocus}
                size={m.size}
              />
            )}
            {m.inputType === FieldType.FULLNAME && (
              <AppInput
                control={control}
                name={m.name}
                title={m.title}
                type="text"
                pattern={FieldValidator.FULLNAME}
                autoCapitalize={m.autoCapitalize}
                autoComplete={m.autoComplete}
                className={m.className}
                comparedMatch={m.comparedMatch}
                watch={m.watch}
                errors={customMessage}
                icon={m.icon}
                iconRignt={m.iconRignt}
                iconSize={m.iconSize}
                importantForAutofill={m.importantForAutofill}
                inputRef={m.inputRef}
                isDisabled={m.isDisabled}
                isFocused={m.isFocused}
                isInvalid={isInvalid}
                isReadOnly={m.readOnly}
                keyboardType={m.keyboardType}
                matchField={m.matchField}
                onSubmitEditing={m.onSubmitEditing}
                p={m.p}
                placeholder={m.placeHolder}
                required={m.required}
                returnKeyType={m.returnKeyType}
                setFocus={m.setFocus}
                size={m.size}
              />
            )}
            {m.inputType === FieldType.FIELD && (
              <AppInput
                control={control}
                name={m.name}
                title={m.title}
                type="text"
                pattern={FieldValidator.FIELD}
                autoCapitalize={m.autoCapitalize}
                autoComplete={m.autoComplete}
                className={m.className}
                comparedMatch={m.comparedMatch}
                watch={m.watch}
                errors={customMessage}
                icon={m.icon}
                iconRignt={m.iconRignt}
                iconSize={m.iconSize}
                importantForAutofill={m.importantForAutofill}
                inputRef={m.inputRef}
                isDisabled={m.isDisabled}
                isFocused={m.isFocused}
                isInvalid={isInvalid}
                isReadOnly={m.readOnly}
                keyboardType={m.keyboardType}
                matchField={m.matchField}
                onSubmitEditing={m.onSubmitEditing}
                p={m.p}
                placeholder={m.placeHolder}
                required={m.required}
                returnKeyType={m.returnKeyType}
                setFocus={m.setFocus}
                size={m.size}
              />
            )}
            {m.inputType === FieldType.MULTILINE && (
              <AppTextArea
                control={control}
                name={m.name}
                title={m.title}
                type="text"
                pattern={FieldValidator.FIELD}
                autoCapitalize={m.autoCapitalize}
                autoComplete={m.autoComplete}
                className={m.className}
                comparedMatch={m.comparedMatch}
                watch={m.watch}
                errors={customMessage}
                icon={m.icon}
                iconRignt={m.iconRignt}
                iconSize={m.iconSize}
                importantForAutofill={m.importantForAutofill}
                inputRef={m.inputRef}
                isDisabled={m.isDisabled}
                isFocused={m.isFocused}
                isInvalid={isInvalid}
                isReadOnly={m.readOnly}
                keyboardType={m.keyboardType}
                matchField={m.matchField}
                onSubmitEditing={m.onSubmitEditing}
                p={m.p}
                placeholder={m.placeHolder}
                required={m.required}
                returnKeyType={m.returnKeyType}
                setFocus={m.setFocus}
                size={m.size}
              />
            )}
            {m.inputType === FieldType.EMAIL && (
              <AppInput
                control={control}
                name={m.name}
                title={m.title}
                type="text"
                pattern={FieldValidator.EMAIL}
                autoCapitalize={m.autoCapitalize}
                autoComplete={m.autoComplete}
                className={m.className}
                comparedMatch={m.comparedMatch}
                watch={m.watch}
                errors={customMessage}
                icon={m.icon}
                iconRignt={m.iconRignt}
                iconSize={m.iconSize}
                importantForAutofill={m.importantForAutofill}
                inputRef={m.inputRef}
                isDisabled={m.isDisabled}
                isFocused={m.isFocused}
                isInvalid={isInvalid}
                isReadOnly={m.readOnly}
                keyboardType={m.keyboardType}
                matchField={m.matchField}
                onSubmitEditing={m.onSubmitEditing}
                p={m.p}
                placeholder={m.placeHolder}
                required={m.required}
                returnKeyType={m.returnKeyType}
                setFocus={m.setFocus}
                size={m.size}
              />
            )}
            {m.inputType === FieldType.PASSWORD && (
              <AppInput
                control={control}
                name={m.name}
                title={m.title}
                type="password"
                autoCapitalize={m.autoCapitalize}
                autoComplete={m.autoComplete}
                className={m.className}
                comparedMatch={m.comparedMatch}
                watch={m.watch}
                errors={customMessage}
                icon={m.icon}
                iconRignt={m.iconRignt}
                iconSize={m.iconSize}
                importantForAutofill={m.importantForAutofill}
                inputRef={m.inputRef}
                isDisabled={m.isDisabled}
                isFocused={m.isFocused}
                isInvalid={isInvalid}
                isReadOnly={m.readOnly}
                keyboardType={m.keyboardType}
                matchField={m.matchField}
                onSubmitEditing={m.onSubmitEditing}
                p={m.p}
                placeholder={m.placeHolder}
                required={m.required}
                returnKeyType={m.returnKeyType}
                setFocus={m.setFocus}
                size={m.size}
              />
            )}
            {m.inputType === FieldType.SELECT && (
              <AppSelect
                control={control}
                name={m.name}
                title={m.title}
                className={m.className}
                errors={customMessage}
                inputRef={m.inputRef}
                isDisabled={m.isDisabled}
                isInvalid={isInvalid}
                isReadOnly={m.readOnly}
                matchField={m.matchField}
                p={m.p}
                placeholder={m.placeHolder}
                required={m.required}
                size={m.size}
                option={m.option}
              />
            )}
            {m.inputType === FieldType.PHONE_NUMBER && (
              <AppPhoneNumber
                control={control}
                name={m.name}
                title={m.title}
                errors={customMessage}
                inputRef={m.inputRef}
                isDisabled={m.isDisabled}
                isInvalid={isInvalid}
                placeholder={m.placeHolder}
                required={m.required}
                size={m.size}
              />
            )}
            {m.inputType === FieldType.DATE && (
              <AppDate
                control={control}
                name={m.name}
                title={m.title}
                errors={customMessage}
                inputRef={m.inputRef}
                isDisabled={m.isDisabled}
                isInvalid={isInvalid}
                placeholder={m.placeHolder}
                required={m.required}
                size={m.size}
                minDate={m.minDate}
                maxDate={m.maxDate}
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}

export default AppForm;
