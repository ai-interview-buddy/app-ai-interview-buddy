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
import { Input, InputField } from "@/components/ui/input";
import { isFieldRequired, isFormFieldInvalid } from "@/lib/utils/validation.utils";
import React, { useState } from "react";

type Props = {
  name: string;
  label: string;
  form: any;
  formSchema?: any;
  placeholder?: string;
  helper?: string;
  className?: string;
};

export const FormFieldUrl = ({ form, name, label, placeholder, helper, formSchema, className }: Props) => {
  const required = isFieldRequired(formSchema, name);
  const [previousText, setPreviousText] = useState("");

  const handleChange = (text: string, callback: (value: string) => void) => {
    let actualText: string = text;
    const newLen = text?.length ?? 0;
    const prevLen = previousText?.length ?? 0;
    const isPasteChange = newLen > prevLen && newLen - prevLen > 5;

    if (isPasteChange) {
      const regex = /(https?:\/\/[^\s"'’”<>)]*[^\s"'’”<>\s).,!?;:])/i;
      const match = text.match(regex);

      actualText = match ? match[0].trim() : text;
    }

    setPreviousText(actualText);
    callback(actualText);
  };

  return (
    <form.Field
      name={name}
      children={(field: any) => {
        const isInvalid = isFormFieldInvalid(form, field);
        return (
          <FormControl isInvalid={isInvalid} isRequired={required} size="md" style={{ marginBottom: 16 }}>
            <FormControlLabel>
              <FormControlLabelText>{label}</FormControlLabelText>
            </FormControlLabel>

            <Input size="md" className={className}>
              <InputField
                placeholder={placeholder}
                value={field.state.value}
                onChangeText={(text) => handleChange(text, field.handleChange)}
                autoCapitalize="none"
              />
            </Input>

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
