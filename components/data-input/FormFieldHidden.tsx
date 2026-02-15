import React, { useEffect } from "react";
import { Platform } from "react-native";

type Props = {
  name: string;
  form: any;
  value?: string;
};

const FormFieldHiddenInner = ({ name, value, field }: { name: string; value: string | undefined; field: any }) => {
  useEffect(() => {
    if (value !== undefined) {
      field.handleChange(value);
    }
  }, [value]);

  if (Platform.OS === "web") {
    return <input type="hidden" name={name} value={field.state.value ?? ""} onChange={(e) => field.handleChange(e.target.value)} />;
  }

  return null;
};

export const FormFieldHidden = ({ form, name, value }: Props) => {
  return (
    <form.Field name={name}>
      {(field: any) => <FormFieldHiddenInner name={name} value={value} field={field} />}
    </form.Field>
  );
};
