import { useCareerProfiles } from "@/lib/api/careerProfile.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { CareerProfile } from "@/supabase/functions/api/types/CareerProfile";
import React from "react";
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
