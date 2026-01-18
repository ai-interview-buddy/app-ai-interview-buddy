import { FloatingActionLink } from "@/components/button/FloatingActionLink";
import { MainContainer } from "@/components/container/MainContainer";
import { TitleListHeader } from "@/components/headers/TitleListHeader";
import { InterviewListItem } from "@/components/interview/InterviewListItem";
import { EmptyState } from "@/components/views/EmptyState";
import { PageLoading } from "@/components/views/PageLoading";
import { useTimelineItems } from "@/lib/api/timelineItem.query";
import { useUiStore } from "@/lib/storage/uiStore";
import { useAuthStore } from "@/lib/supabase/authStore";
import { TimelineFilter } from "@/supabase/functions/api/types/TimelineItem";
import { Link, Stack } from "expo-router";
import React, { useEffect } from "react";
import { RefreshControl, ScrollView, View } from "react-native";

const InterviewList: React.FC = () => {
  const { user } = useAuthStore();
  const { markAsOpened } = useUiStore();
  const params: TimelineFilter = { type: "INTERVIEW_ANALYSE", unpaged: true };
  const { data, isSuccess, isRefetching, isLoading, refetch } = useTimelineItems(user?.accessToken, params);
  const isEmpty = isSuccess && data.length === 0;

  useEffect(() => {
    markAsOpened("hasOpenedInterviews");
  }, []);

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MainContainer>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} colors={["#FFC629"]} tintColor="#FFC629" />}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <TitleListHeader title="Interviews" info="Capture your interview and get AI powered feedback" />

          {isEmpty && (
            <EmptyState title="No Interviews Yet">Create your first interview to get personalized feedback and recommendations.</EmptyState>
          )}

          {!isEmpty && (
            <View>
              {data?.map((item) => (
                <Link key={item.id} href={`/interview/${item.id}`} push asChild>
                  <InterviewListItem item={item} />
                </Link>
              ))}
            </View>
          )}
        </ScrollView>

        <FloatingActionLink href="/interview/create-interview" />
      </MainContainer>
    </>
  );
};

export default InterviewList;
