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
import { AlertCircleIcon, CircleIcon } from "@/components/ui/icon";
import { isFieldRequired, isFormFieldInvalid } from "@/lib/utils/validation.utils";
import React from "react";
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from "../ui/radio";
import { VStack } from "../ui/vstack";

export type FormFieldRadioGroupOption = {
  label: string;
  value: any;
};

export type Props = {
  name: string;
  label: string;
  options: FormFieldRadioGroupOption[];
  form: any;
  formSchema?: any;
  placeholder?: string;
  helper?: string;
  className?: string;
};

export const FormFieldRadioGroup = ({ form, name, label, options, placeholder, helper, formSchema, className }: Props) => {
  const required = isFieldRequired(formSchema, name);

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

            <RadioGroup value={field.state.value} onChange={field.handleChange}>
              <VStack space="sm">
                {options.map((opt) => {
                  return (
                    <Radio value={opt.value} size="md" key={opt.value}>
                      <RadioIndicator>
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                      <RadioLabel>{opt.label} </RadioLabel>
                    </Radio>
                  );
                })}
              </VStack>
            </RadioGroup>

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
