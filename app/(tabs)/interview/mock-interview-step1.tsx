import { MainContainer } from "@/components/container/MainContainer";
import { UploadProgressDialog } from "@/components/dialogs/UploadProgressDialog";
import { TitleBackHeader } from "@/components/headers/TitleBackHeader";
import { InterviewActiveView } from "@/components/interview-mock/InterviewActiveView";
import { InterviewGeneratingView } from "@/components/interview-mock/InterviewGeneratingView";
import { InterviewPreparationFormValues, InterviewPreparationView } from "@/components/interview-mock/InterviewPreparationView";
import AlertPolyfill from "@/components/ui/alert-web/AlertPolyfill";
import { useAnalyseMockInterview } from "@/lib/api/interviewQuestion.query";
import { useCreateJobPositionByDescription } from "@/lib/api/jobPosition.query";
import { useCreateMockInterview } from "@/lib/api/mockInterview.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { MockInterviewResponse } from "@/supabase/functions/api/types/MockInterview";
import { useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import type React from "react";
import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";

type InterviewState = "preparation" | "generating" | "active";

const MockInterviewPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [mockInterview, setMockInterview] = useState<MockInterviewResponse | null>(null);
  const { positionId, profileId } = useLocalSearchParams<{ positionId: string; profileId: string }>();
  const queryClient = useQueryClient();
  const { mutateAsync } = useCreateMockInterview(queryClient, user?.accessToken);
  const createJob = useCreateJobPositionByDescription(queryClient, user?.accessToken);
  const analyseInterview = useAnalyseMockInterview(queryClient, user?.accessToken);

  const [state, setState] = useState<InterviewState>("preparation");
  const [progressPct, setProgressPct] = useState<number | boolean>(false);

  const handleStartInterview = async (values: InterviewPreparationFormValues) => {
    setState("generating");
    try {
      const { profileId: formProfileId, jobDescription: formJobDescription, customInstructions } = values;

      let finalPositionId = positionId;
      let finalProfileId = profileId || formProfileId;

      const trimmedDescription = formJobDescription?.trim();

      if (trimmedDescription && finalProfileId) {
        const saved = await createJob.mutateAsync({
          profileId: finalProfileId.trim(),
          jobDescription: trimmedDescription,
        });
        finalPositionId = saved.id;
      }

      const body = {
        positionId: finalPositionId,
        profileId: finalProfileId,
        customInstructions,
      };

      const mockInterviewResponse = await mutateAsync(body);
      setMockInterview(mockInterviewResponse);

      setState("active");
    } catch (err) {
      console.error(err);
      AlertPolyfill("Error", "Failed to start interview. Please try again.");
      setState("preparation");
    }
  };

  const handleEndInterview = async (transcript: any[]) => {
    console.log("RTC: Interview Ended. Transcript:", JSON.stringify(transcript, null, 2));

    const timers: ReturnType<typeof setTimeout>[] = [];
    const schedule = [
      { delay: 500, progress: 3 },
      { delay: 1500, progress: 10 },
      { delay: 3000, progress: 24 },
      { delay: 5000, progress: 30 },
      { delay: 10000, progress: 39 },
      { delay: 15000, progress: 55 },
      { delay: 20000, progress: 70 },
      { delay: 40000, progress: 89 },
      { delay: 60000, progress: 92 },
      { delay: 80000, progress: 96 },
      { delay: 120000, progress: 98 },
    ];

    try {
      setProgressPct(0);
      schedule.forEach(({ delay, progress }) => {
        const timer = setTimeout(() => setProgressPct(progress), delay);
        timers.push(timer);
      });

      const result = await analyseInterview.mutateAsync({
        positionId,
        transcript,
      });

      router.replace(`/interview/${result.id}`);
    } catch (err) {
      console.error("Failed to analyse interview:", err);
      AlertPolyfill("Error", "Failed to analyze your interview. You can try again from the history.");
    } finally {
      timers.forEach((timer) => clearTimeout(timer));
      setProgressPct(false);
    }
  };

  const handleBack = () => (positionId ? router.push(`/job-position/${positionId}`) : router.push("/interview/create-interview"));
  const handleCancel = () => (positionId ? router.replace(`/job-position`) : router.replace("/interview/create-interview"));

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MainContainer>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <TitleBackHeader pageTitle="Mock Interview" handleBack={handleBack} handleCancel={handleCancel} />

          {/* State 1: Preparation */}
          {state === "preparation" && <InterviewPreparationView onStartInterview={handleStartInterview} positionId={positionId} />}

          {/* State 2: Generating */}
          {state === "generating" && <InterviewGeneratingView />}

          {/* State 3: Active Interview */}
          {state === "active" && <InterviewActiveView mockInterviewResponse={mockInterview} handleEndInterview={handleEndInterview} />}
        </KeyboardAvoidingView>
      </MainContainer>

      <UploadProgressDialog progress={progressPct} />
    </>
  );
};

export default MockInterviewPage;
