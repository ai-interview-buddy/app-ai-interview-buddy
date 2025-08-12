import { PageLoading } from "@/components/views/PageLoading";
import { useInterviewQuestions } from "@/lib/api/interviewQuestion.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { TimelineItem } from "@/supabase/functions/api/types/TimelineItem";
import { default as React, useState } from "react";
import { Dimensions } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import InterviewProcessingLoading from "./InterviewProcessingLoading";
import { OverviewTab } from "./tabs/OverviewTab";
import { QuestionsTab } from "./tabs/QuestionsTab";
import { TranscriptTab } from "./tabs/TranscriptTab";

interface Props {
  timelineItem: TimelineItem;
}
const { width } = Dimensions.get("window");

export const InterviewQuestionMain = ({ timelineItem }: Props) => {
  const { user } = useAuthStore();

  const [index, setIndex] = useState(0);
  const { data: questions, isLoading } = useInterviewQuestions(user?.accessToken, { unpaged: true, timelineItemId: timelineItem?.id });

  const routes = [
    { key: "overview", title: "Overview" },
    { key: "questions", title: "Questions" },
    { key: "transcript", title: "Transcript" },
  ];

  if (!timelineItem || !questions || isLoading) {
    return <PageLoading />;
  }

  if (!timelineItem.text && !timelineItem.interviewScore) {
    return <InterviewProcessingLoading timelineItem={timelineItem} />;
  }

  const renderScene = SceneMap({
    overview: () => <OverviewTab timelineItem={timelineItem} questions={questions} />,
    questions: () => <QuestionsTab timelineItem={timelineItem} questions={questions} />,
    transcript: () => <TranscriptTab timelineItem={timelineItem} />,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: "#FFC629",
        height: 3,
      }}
      style={{
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
      labelStyle={{
        fontSize: 14,
        fontWeight: "600",
        textTransform: "none",
      }}
      activeColor="#1D252C"
      inactiveColor="#9CA3AF"
    />
  );

  return (
    <>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width }}
        renderTabBar={renderTabBar}
      />
    </>
  );
};
