import { MainContainer } from "@/components/container/MainContainer";
import { TitleBackHeader } from "@/components/headers/TitleBackHeader";
import { InterviewQuestionMain } from "@/components/timeline-item/interview-question/InterviewQuestionMain";
import { PageLoading } from "@/components/views/PageLoading";
import { useTimelineItem } from "@/lib/api/timelineItem.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";

export default function TimelineItemView() {
  const router = useRouter();
  const { timelineItemId } = useLocalSearchParams();
  const { user } = useAuthStore();

  const { data: record, isLoading, error } = useTimelineItem(user?.accessToken, timelineItemId as string);

  if (isLoading || !record) {
    return <PageLoading />;
  }

  const handleBack = () => router.back();
  const handleCancel = () => router.push("/interview");

  const isInterviewQuestion = record.type == "INTERVIEW_ANALYSE";
  if (!isInterviewQuestion) {
    handleCancel();
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MainContainer>
        <TitleBackHeader pageTitle={record.title} handleBack={handleBack} handleCancel={handleCancel} />

        <InterviewQuestionMain timelineItem={record} linkType="interview" />
      </MainContainer>
    </>
  );
}
