import { MainContainer } from "@/components/container/MainContainer";
import { TitleBackHeader } from "@/components/headers/TitleBackHeader";
import { MarkdownCopyView } from "@/components/misc/MarkdownCopyView";
import { PageLoading } from "@/components/views/PageLoading";
import { useTimelineItem } from "@/lib/api/timelineItem.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";

export default function TimelineItemView() {
  const router = useRouter();
  const { id, timelineItemId } = useLocalSearchParams();
  const { user } = useAuthStore();

  const { data: record, isLoading, error } = useTimelineItem(user?.accessToken, timelineItemId as string);

  if (isLoading || !record) {
    return <PageLoading />;
  }

  const handleBack = () => router.push(`/job-position/${id}`);
  const handleCancel = () => router.push("/job-position");

  const isMarkdown =
    record.type == "COVER_LETTER" || record.type == "NOTE" || record.type == "LINKEDIN_INTRO" || record.type == "REPLY_EMAIL";

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MainContainer>
        <TitleBackHeader pageTitle={record.title} handleBack={handleBack} handleCancel={handleCancel} />

        {isMarkdown && <MarkdownCopyView markdownText={record.text} />}

        {/* CV_ANALYSE INTERVIEW_STEP INTERVIEW_ANALYSE */}
      </MainContainer>
    </>
  );
}
