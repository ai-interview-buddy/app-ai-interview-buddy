import { MainAction } from "@/components/button/MainAction";
import { MainContainer } from "@/components/container/MainContainer";
import { FormFieldInput } from "@/components/data-input/FormFieldInput";
import { SelectCareerProfile } from "@/components/data-input/SelectCareerProfile";
import { CenteredTextHeading } from "@/components/headers/CenteredTextHeading";
import { TitleBackHeader } from "@/components/headers/TitleBackHeader";
import { StepIndicator } from "@/components/misc/StepIndicator";
import AlertPolyfill from "@/components/ui/alert-web/AlertPolyfill";
import { useCreateJobPositionByUrl } from "@/lib/api/jobPosition.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { z } from "zod";

const formSchema = z.object({
  profileId: z.string().min(1, "Career Profile is required"),
  jobUrl: z.string().url("Enter a valid URL").min(1, "Job URL is required"),
});

export default function CreateStep2Url() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const createJob = useCreateJobPositionByUrl(queryClient, user?.accessToken);

  const defaultValues = { profileId: "", jobUrl: "" };

  const form = useForm({
    defaultValues,
    validators: { onChange: formSchema },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      try {
        const saved = await createJob.mutateAsync({
          profileId: value.profileId.trim(),
          jobUrl: value.jobUrl.trim(),
        });
        router.push(`/(tabs)/job-position/${saved.id}`);
      } catch (err) {
        console.error(err);
        AlertPolyfill("Error", "Failed to create job position. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleBack = () => router.push("/job-position/create-step1");
  const handleCancel = () => router.push("/job-position");

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <MainContainer>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <TitleBackHeader pageTitle="New Position" handleBack={handleBack} handleCancel={handleCancel} />

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 20,
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ flex: 1 }}>
              <StepIndicator currentStep={2} totalSteps={2} />
              <CenteredTextHeading title="Enter Job URL" subtitle="Paste the job posting URL below" />

              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 16,
                  padding: 20,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <SelectCareerProfile name="profileId" label="Career Profile" form={form} formSchema={formSchema} />
                <FormFieldInput
                  form={form}
                  formSchema={formSchema}
                  name="jobUrl"
                  label="Job Posting URL"
                  placeholder="https://company.com/jobs/position"
                />
              </View>
            </View>

            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 20,
                backgroundColor: "#FEFBED",
                borderRadius: 12,
              }}
            >
              <MainAction isLoading={isLoading} onPress={form.handleSubmit} loadingText="Saving...">
                Save Position
              </MainAction>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </MainContainer>
    </>
  );
}
