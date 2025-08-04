import { MainAction } from "@/components/button/MainAction";
import { MainContainer } from "@/components/container/MainContainer";
import { FormFieldInput } from "@/components/data-input/FormFieldInput";
import { FormFieldTextArea } from "@/components/data-input/FormFieldTextArea";
import { CenteredTextHeading } from "@/components/headers/CenteredTextHeading";
import { TitleBackHeader } from "@/components/headers/TitleBackHeader";
import { PageLoading } from "@/components/views/PageLoading";
import { useJobPosition } from "@/lib/api/jobPosition.query";
import { useCreateTimelineLinkedinIntro } from "@/lib/api/timelineItem.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { z } from "zod";

const formSchema = z.object({
  greeting: z.string().optional(),
  customInstructions: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const TimelineCreateLinkedinIntro: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: record, isLoading } = useJobPosition(user?.accessToken, id as string);

  const createItem = useCreateTimelineLinkedinIntro(queryClient, user?.accessToken);

  const [saving, setSaving] = useState(false);

  const defaultValues: FormValues = {
    greeting: undefined,
    customInstructions:
      "Create a short, direct introductory message that highlights my experience and the aspects I share with the position.",
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
          greeting: value.greeting?.trim(),
          customInstructions: value.customInstructions.trim(),
        });
        router.push(`/job-position/${id}/timeline/${saved.id}`);
      } catch (e) {
        console.error(e);
        Alert.alert("Error", "Failed to create timeline item. Please try again.");
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
        <TitleBackHeader pageTitle="LinkedIn Intro" handleBack={handleBack} handleCancel={handleCancel} />
        <CenteredTextHeading title="Create a LinkedIn Intro" subtitle="Make a standout first impression" />

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
            <FormFieldInput
              form={form}
              formSchema={formSchema}
              name="greeting"
              label="Greeting"
              placeholder="Hi Sam! I hope you are well."
              helper="Optional, the system can create a generic one"
            />
            <FormFieldTextArea
              form={form}
              formSchema={formSchema}
              name="customInstructions"
              label="LinkedIn Instructions"
              placeholder="Create a direct and polite message..."
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
            Create LinkedIn Intro
          </MainAction>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default TimelineCreateLinkedinIntro;
