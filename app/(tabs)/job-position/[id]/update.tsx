import { MainAction } from "@/components/button/MainAction";
import { MainContainer } from "@/components/container/MainContainer";
import { FormFieldInput } from "@/components/data-input/FormFieldInput";
import { SelectCareerProfile } from "@/components/data-input/SelectCareerProfile";
import { TitleBackHeader } from "@/components/headers/TitleBackHeader";
import { PageLoading } from "@/components/views/PageLoading";
import { useJobPosition, useUpdateJobPosition } from "@/lib/api/jobPosition.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { z } from "zod";

const formSchema = z.object({
  careerProfileId: z.string().min(1, "Career Profile is required"),
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job Title is required"),
  companyWebsite: z.string().nullable().optional(),
  expectedSalary: z.string().nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const UpdateJobPosition: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: record, isLoading, error } = useJobPosition(user?.accessToken, id as string);

  const updateJob = useUpdateJobPosition(queryClient, user?.accessToken);

  const [saving, setSaving] = useState(false);

  const defaultValues: FormValues = {
    careerProfileId: record?.careerProfileId || "",
    companyName: record?.companyName || "",
    companyWebsite: record?.companyWebsite || "",
    jobTitle: record?.jobTitle || "",
    expectedSalary: record?.expectedSalary,
  };

  const form = useForm({
    defaultValues: defaultValues,
    validators: { onChange: formSchema },
    onSubmit: async ({ value }) => {
      if (!id) return;
      setSaving(true);
      try {
        await updateJob.mutateAsync({
          id: String(id),
          data: {
            careerProfileId: value.careerProfileId.trim(),
            companyName: value.companyName.trim(),
            companyWebsite: value.companyWebsite?.trim(),
            jobTitle: value?.jobTitle?.trim() || "",
            expectedSalary: value.expectedSalary?.trim() ?? "",
          },
        });
        router.push(`/job-position/${id}`);
      } catch (e) {
        console.error(e);
        Alert.alert("Error", "Failed to update job position. Please try again.");
      } finally {
        setSaving(false);
      }
    },
  });

  const handleBack = () => router.push(`/job-position/${id}`);
  const handleCancel = () => router.push("/job-position");

  if (isLoading || !record) {
    return <PageLoading />;
  }

  return (
    <MainContainer>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TitleBackHeader pageTitle="Update Position" handleBack={handleBack} handleCancel={handleCancel} />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 20,
              padding: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <SelectCareerProfile name="careerProfileId" label="Career Profile" form={form} formSchema={formSchema} />

            <FormFieldInput form={form} formSchema={formSchema} name="jobTitle" label="Job Title" placeholder="Enter job title" />

            <FormFieldInput form={form} formSchema={formSchema} name="companyName" label="Company Name" placeholder="Enter company name" />

            <FormFieldInput
              form={form}
              formSchema={formSchema}
              name="companyWebsite"
              label="Company Website"
              placeholder="Enter company website"
            />

            <FormFieldInput
              form={form}
              formSchema={formSchema}
              name="expectedSalary"
              label="Expected Salary"
              placeholder="Enter expected salary, eg.: Between 100 and 130"
            />
          </View>
        </ScrollView>

        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            backgroundColor: "#FEFBED",
            borderRadius: 12,
          }}
        >
          <MainAction isLoading={saving} onPress={form.handleSubmit} loadingText="Saving...">
            Save Position
          </MainAction>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default UpdateJobPosition;
