import { MainAction } from "@/components/button/MainAction";
import { MainContainer } from "@/components/container/MainContainer";
import { FormFieldTextArea } from "@/components/data-input/FormFieldTextArea";
import { CenteredTextHeading } from "@/components/headers/CenteredTextHeading";
import { TitleBackHeader } from "@/components/headers/TitleBackHeader";
import { PageLoading } from "@/components/views/PageLoading";
import { useJobPosition } from "@/lib/api/jobPosition.query";
import { useCreateTimelineReplyEmail } from "@/lib/api/timelineItem.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { z } from "zod";

const formSchema = z.object({
  emailBody: z.string().min(1, "Received Email is required"),
  customInstructions: z.string().min(1, "Custom Instructions is required"),
});

type FormValues = z.infer<typeof formSchema>;

const TimelineReplyEmail: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: record, isLoading } = useJobPosition(user?.accessToken, id as string);

  const createItem = useCreateTimelineReplyEmail(queryClient, user?.accessToken);

  const [saving, setSaving] = useState(false);

  const defaultValues: FormValues = {
    emailBody: "",
    customInstructions:
      "Please keep the tone warm and enthusiastic, but still professional. Mention that I believe my background aligns well with the position.",
  };

  const form = useForm({
    defaultValues: defaultValues,
    validators: { onChange: formSchema },
    onSubmit: async ({ value }) => {
      if (!id || !record?.id) return;
      setSaving(true);
      try {
        const saved = await createItem.mutateAsync({
          positionId: record?.id,
          emailBody: value.emailBody.trim(),
          customInstructions: value.customInstructions.trim(),
        });
        router.push(`/job-position/${id}/timeline/${saved.id}`);
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
        <TitleBackHeader pageTitle="Email Reply" handleBack={handleBack} handleCancel={handleCancel} />
        <CenteredTextHeading title="Draft a Reply" subtitle="Paste the incoming email and we'll craft your response." />

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
            <FormFieldTextArea
              form={form}
              formSchema={formSchema}
              name="emailBody"
              label="Received Email"
              placeholder="Hello, Thanks for applying for Rochec Inc, we are glad to inform you that we would like to book a meeting."
              className="h-60"
              helper="Paste the recieved email here"
            />
            <FormFieldTextArea
              form={form}
              formSchema={formSchema}
              name="customInstructions"
              label="Custom Instructions"
              placeholder="Mention that I believe my background aligns well with the position"
              className="h-40"
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
            Write My Reply
          </MainAction>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default TimelineReplyEmail;
