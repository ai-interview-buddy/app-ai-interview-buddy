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
import { AlertCircleIcon, ChevronDownIcon } from "@/components/ui/icon";
import {
    Select,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectIcon,
    SelectInput,
    SelectItem,
    SelectPortal,
    SelectTrigger,
} from "@/components/ui/select";
import { isFieldRequired, isFormFieldInvalid } from "@/lib/utils/validation.utils";
import React from "react";

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
};

export const FormFieldSelect = ({ form, name, label, options, placeholder, helper, formSchema }: Props) => {
  const required = isFieldRequired(formSchema, name);
  const currentOption = options.find((opt) => String(opt.value) === String(form.getFieldValue(name)));
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
            <Select
              initialLabel={currentOption?.label}
              defaultValue={field.state.value}
              selectedValue={field.state.value}
              onValueChange={field.handleChange}
              isInvalid={isInvalid}
              isRequired={required}
            >
              <SelectTrigger size="md" variant="outline">
                <SelectInput placeholder={placeholder || "Select option"} />
                <SelectIcon className="mr-3" as={ChevronDownIcon} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {options.map((opt) => (
                    <SelectItem key={opt.value} label={opt.label} value={opt.value} />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
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
