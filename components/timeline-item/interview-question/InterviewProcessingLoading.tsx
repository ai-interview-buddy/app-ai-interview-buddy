import { ButtonMain } from "@/components/button/ButtonMain";
import { invalidateInterviewQuestionQueries, useInterviewQuestions } from "@/lib/api/interviewQuestion.query";
import { useTimelineItem } from "@/lib/api/timelineItem.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { TimelineItem } from "@/supabase/functions/api/types/TimelineItem";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Text, View } from "react-native";

interface Props {
  timelineItem: TimelineItem;
}

const InterviewProcessingLoading = ({ timelineItem }: Props) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { isLoading } = useInterviewQuestions(user?.accessToken, { unpaged: true, timelineItemId: timelineItem?.id });
  const { isLoading: isLoadingTimeline } = useTimelineItem(user?.accessToken, timelineItem.id, {
    refetchInterval: 10000,
  });

  const handleRefresh = async () => {
    invalidateInterviewQuestionQueries(queryClient);
  };

  return (
    <>
      <View
        style={{
          alignItems: "center",
          marginHorizontal: 20,
        }}
      >
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "#FFC629",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#FFC629",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 8,
            marginBottom: 60,
          }}
        >
          <Ionicons name="speedometer-outline" size={40} color="#1D252C" />
        </View>

        <Text
          style={{
            fontSize: 24,
            fontWeight: "800",
            color: "#1D252C",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          Analyzing Your Interview
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: "#6B7280",
            textAlign: "center",
            lineHeight: 24,
            marginBottom: 24,
          }}
        >
          Our AI is carefully analyzing your responses, speech patterns, and content quality to provide detailed feedback.
        </Text>

        <View
          style={{
            backgroundColor: "#FFF7DE",
            borderRadius: 12,
            padding: 16,
            flexDirection: "row",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          <Ionicons name="information-circle" size={20} color="#E3AA1F" style={{ marginRight: 12, marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#92400E",
                marginBottom: 4,
              }}
            >
              Processing can take up to 15 minutes
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#92400E",
                lineHeight: 18,
              }}
            >
              Complex interviews with multiple questions require thorough analysis. You can safely close this screen and return later.
            </Text>
          </View>
        </View>
        <View style={{ width: "100%", height: 50 }}>
          <ButtonMain label="Refresh" icon="refresh-outline" disabled={isLoading || isLoadingTimeline} onPress={handleRefresh} />
        </View>
      </View>
    </>
  );
};

export default InterviewProcessingLoading;
