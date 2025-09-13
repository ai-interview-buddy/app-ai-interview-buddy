import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { AlertCircleIcon } from "@/components/ui/icon";
import { isFieldRequired, isFormFieldInvalid } from "@/lib/utils/validation.utils";
import React from "react";
import { View } from "react-native";
import Dropdown from "react-native-input-select";

export type FormFieldSelectOption = {
  label: string;
  value: any;
};

export type Props = {
  name: string;
  label: string;
  options: FormFieldSelectOption[];
  form: any;
  formSchema?: any;
  placeholder?: string;
  helper?: string;
  className?: string;
};

export const FormFieldSelect = ({ form, name, label, options, placeholder, helper, formSchema, className }: Props) => {
  const required = isFieldRequired(formSchema, name);
  const currentOption = options.find((opt) => String(opt.value) === String(form.getFieldValue(name)));

  const optionsArr = options.map((opt) => ({ label: opt.label, value: opt.value }));

  return (
    <form.Field
      name={name}
      children={(field: any) => {
        const isInvalid = isFormFieldInvalid(form, field);
        return (
          <FormControl isInvalid={isInvalid} isRequired={required} style={{ marginBottom: 16 }}>
            <FormControlLabel>
              <FormControlLabelText>{label}</FormControlLabelText>
            </FormControlLabel>

            <View
              style={{
                borderWidth: 1,
                borderColor: "#D1D5DB", // ~ gray-300
                borderRadius: 12,
                backgroundColor: "white",
                height: 42,
              }}
            >
              <Dropdown
                placeholder={placeholder}
                options={optionsArr}
                selectedValue={field.state.value}
                onValueChange={field.handleChange}
                primaryColor="green"
                dropdownStyle={{
                  borderColor: "white",
                  borderWidth: 0,
                  paddingVertical: 5,
                  paddingHorizontal: 5,
                  minHeight: 38,
                  margin: 0,
                }}
                selectedItemStyle={{
                  paddingHorizontal: 5,
                }}
                dropdownIconStyle={{
                  top: 16,
                  right: 16,
                }}
              />
            </View>

            {helper ? (
              <FormControlHelper>
                <FormControlHelperText>{helper}</FormControlHelperText>
              </FormControlHelper>
            ) : null}
            {isInvalid && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>{field.state.meta.errors?.[0]?.message}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
        );
      }}
    ></form.Field>
  );
};
