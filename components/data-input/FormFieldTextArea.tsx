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
import { Textarea, TextareaInput } from "../ui/textarea";

type Props = {
  name: string;
  label: string;
  form: any;
  formSchema?: any;
  placeholder?: string;
  helper?: string;
  className?: string;
};

export const FormFieldTextArea = ({ form, name, label, placeholder, helper, formSchema, className = "h-40" }: Props) => {
  const required = isFieldRequired(formSchema, name);
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

            <Textarea size="md" isReadOnly={false} isInvalid={false} isDisabled={false} className={`w-100 ${className}`}>
              <TextareaInput placeholder={placeholder} value={field.state.value} onChangeText={field.handleChange} />
            </Textarea>

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
