import { MainContainer } from "@/components/container/MainContainer";
import UploadFileForm from "@/components/data-input/UploadFileForm";
import { UploadProgressDialog } from "@/components/dialogs/UploadProgressDialog";
import { TitleBackHeader } from "@/components/headers/TitleBackHeader";
import { StepIndicator } from "@/components/misc/StepIndicator";
import AlertPolyfill from "@/components/ui/alert-web/AlertPolyfill";
import { useCreateTimelineInterviewAnalyse } from "@/lib/api/timelineItem.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { getFileExtension } from "@/lib/utils/files.utils";
import {
  foregroundServiceStartNotification,
  foregroundServiceStopNotification,
  foregroundServiceUpdateNotification,
} from "@/lib/utils/notification.utils";
import { uploadFile } from "@/lib/utils/tus.utils";
import { useQueryClient } from "@tanstack/react-query";
import { DocumentPickerAsset } from "expo-document-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { default as React, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

const CreateStep2Upload: React.FC = () => {
  const router = useRouter();
  const { jobPositionId } = useLocalSearchParams();

  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { mutateAsync } = useCreateTimelineInterviewAnalyse(queryClient, user?.accessToken);

  const [progressPct, setProgressPct] = useState<number | boolean>(false);

  if (!user) return null;

  const handleSave = async (pickerAsset: DocumentPickerAsset) => {
    const notificationId = await foregroundServiceStartNotification("Uploading recording", "Starting the upload");
    try {
      setProgressPct(0);
      const uri = pickerAsset.name || pickerAsset.uri;
      const fileExt = getFileExtension(uri);
      const filename = `${user.id}/${Date.now()}.${fileExt}`;

      const onProgress = async (bytesUploaded: number, bytesTotal: number) => {
        const uploaded = Math.min(bytesUploaded, bytesTotal); // avoids going above 100%
        const percentage = Math.round((uploaded / bytesTotal) * 100);
        const title = "Uploading recording";
        const body = `current progress: ${percentage}%; [${pickerAsset.name}]`;
        setProgressPct(percentage);
        await foregroundServiceUpdateNotification(notificationId, title, body);
      };

      await uploadFile(user, "interviews", filename, pickerAsset, onProgress);
      const timelineItem = await mutateAsync({ positionId: jobPositionId as string, interviewPath: filename });
      router.replace(jobPositionId ? `/job-position/${jobPositionId}/timeline/${timelineItem.id}` : `/interview/${timelineItem.id}`);
    } catch (error) {
      console.log(error);
      AlertPolyfill("Error", "Failed to upload recording. Please try again.");
    } finally {
      setProgressPct(false);
      await foregroundServiceStopNotification(notificationId);
    }
  };

  const handleBack = () => router.push({ pathname: `/interview/create-interview-analyse-step1`, params: { jobPositionId } });
  const handleCancel = () => (jobPositionId ? router.push(`/job-position`) : router.push("/interview"));

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <MainContainer>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <TitleBackHeader pageTitle="Interview feedback" handleBack={handleBack} handleCancel={handleCancel} />

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            <StepIndicator currentStep={2} totalSteps={2} />

            <UploadFileForm
              title="Upload a recording of an interview"
              subtitle="Please select the audio file containing the recording of your interview"
              allowedTypes={[
                "audio/mpeg", // .mp3, .mp2
                "audio/mp4", // .mp4
                "audio/aac", // .aac
                "audio/wav", // .wav
                "audio/flac", // .flac
                "audio/pcm", // .pcm
                "audio/x-m4a", // .m4a
                "audio/ogg", // .ogg
                "audio/opus", // .opus
                "audio/webm", // .webm
              ]}
              onConfirm={handleSave}
              maxFileSize={50 * 1024 * 1024}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </MainContainer>

      <UploadProgressDialog progress={progressPct} />
    </>
  );
};

export default CreateStep2Upload;
