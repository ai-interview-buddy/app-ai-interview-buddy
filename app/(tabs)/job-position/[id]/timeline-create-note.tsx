import { MainAction } from "@/components/button/MainAction";
import { MainContainer } from "@/components/container/MainContainer";
import { FormFieldInput } from "@/components/data-input/FormFieldInput";
import { FormFieldTextArea } from "@/components/data-input/FormFieldTextArea";
import { CenteredTextHeading } from "@/components/headers/CenteredTextHeading";
import { TitleBackHeader } from "@/components/headers/TitleBackHeader";
import { PageLoading } from "@/components/views/PageLoading";
import { useJobPosition } from "@/lib/api/jobPosition.query";
import { useCreateTimelineNote } from "@/lib/api/timelineItem.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  text: z.string().min(1, "Note is required"),
});

type FormValues = z.infer<typeof formSchema>;

const TimelineCreateNote: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: record, isLoading } = useJobPosition(user?.accessToken, id as string);

  const createItem = useCreateTimelineNote(queryClient, user?.accessToken);

  const [saving, setSaving] = useState(false);

  const defaultValues: FormValues = {
    title: "",
    text: "",
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
          title: value.title.trim(),
          text: value.text.trim(),
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
        <TitleBackHeader pageTitle="Note" handleBack={handleBack} handleCancel={handleCancel} />
        <CenteredTextHeading title="Add a Note" subtitle="Capture your thoughts about this opportunity" />

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
            <FormFieldInput form={form} formSchema={formSchema} name="title" label="Title" placeholder="My notes about the company" />
            <FormFieldTextArea
              form={form}
              formSchema={formSchema}
              name="text"
              label="Note"
              placeholder="Funded by technical founders the company..."
              className="h-80"
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
            Create Note
          </MainAction>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default TimelineCreateNote;
