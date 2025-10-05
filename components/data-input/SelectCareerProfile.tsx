import { useCareerProfiles } from "@/lib/api/careerProfile.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { CareerProfile } from "@/supabase/functions/api/types/CareerProfile";
import React from "react";
import { FormFieldHidden } from "./FormFieldHidden";
import { FormFieldSelect, FormFieldSelectOption } from "./FormFieldSelect";
import { SelectSkeleton } from "./SelectSkeleton";

export type Props = {
  name: string;
  label: string;
  form: any;
  formSchema?: any;
  placeholder?: string;
  helper?: string;
};

export const SelectCareerProfile = ({ form, name, label, placeholder = "Select a Career Profile", helper, formSchema }: Props) => {
  const { user } = useAuthStore();
  const { data, isLoading } = useCareerProfiles(user?.accessToken);

  if (isLoading) {
    return <SelectSkeleton />;
  }

  if (data && data.length < 2) {
    return <FormFieldHidden name={name} form={form} value={data[0]?.id} />;
  }

  const options: FormFieldSelectOption[] = (data || []).map((profile: CareerProfile) => ({
    label: profile.title,
    value: profile.id,
  }));

  return (
    <FormFieldSelect
      name={name}
      label={label}
      options={options}
      form={form}
      formSchema={formSchema}
      placeholder={isLoading ? "Loading..." : placeholder}
      helper={helper}
    />
  );
};
