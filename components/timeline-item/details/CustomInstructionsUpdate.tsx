import { ButtonDefault } from "@/components/button/ButtonDefault";
import { MainAction } from "@/components/button/MainAction";
import { FormFieldTextArea } from "@/components/data-input/FormFieldTextArea";
import { useUpdateCustomInstructions } from "@/lib/api/timelineItem.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { TimelineItem } from "@/supabase/functions/api/types/TimelineItem";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { default as React, useState } from "react";
import { Alert, View } from "react-native";
import { z } from "zod";

interface Props {
  record: TimelineItem;
}

const formSchema = z.object({
  customInstructions: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export const CustomInstructionsUpdate = ({ record }: Props) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const createItem = useUpdateCustomInstructions(queryClient, record.id, user?.accessToken);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const defaultValues: FormValues = {
    customInstructions: record?.customInstructions || "",
  };

  const form = useForm({
    defaultValues: defaultValues,
    validators: { onChange: formSchema },
    onSubmit: async ({ value }) => {
      setSaving(true);
      try {
        await createItem.mutateAsync({
          customInstructions: value.customInstructions.trim(),
        });
        router.replace(`/job-position/${record.positionId}/timeline/${record.id}`);
      } catch (e) {
        console.error(e);
        Alert.alert("Error", "Failed to create timeline item. Please try again.");
      } finally {
        setSaving(false);
      }
    },
  });

  return (
    <>
      <View style={{ borderBottomColor: "#c1c1c1", borderBottomWidth: 1, marginBottom: 20 }} />

      {!showForm && <ButtonDefault label="Edit" icon="create-outline" onPress={() => setShowForm(true)} />}

      {showForm && (
        <>
          <FormFieldTextArea
            form={form}
            formSchema={formSchema}
            name="customInstructions"
            label="Instructions"
            placeholder="Let AI know what you need..."
          />
          <MainAction isLoading={saving} onPress={form.handleSubmit} loadingText="Saving...">
            Update
          </MainAction>
        </>
      )}
    </>
  );
};
