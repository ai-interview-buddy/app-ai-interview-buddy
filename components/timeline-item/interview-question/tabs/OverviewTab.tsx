import { ScoreCircle } from "@/components/misc/ScoreCircle";
import { getQuestionTypeColor, getQuestionTypeLabel, getScoreItemLabel } from "@/lib/utils/questionType.utils";
import { getScoreColor } from "@/lib/utils/score.utils";
import { InterviewQuestion, QuestionType } from "@/supabase/functions/api/types/InterviewQuestion";
import { TimelineItem } from "@/supabase/functions/api/types/TimelineItem";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import InterviewScoreRadar from "./InterviewScoreRadar";

interface Props {
  timelineItem: TimelineItem;
  questions: InterviewQuestion[];
}

export const OverviewTab = ({ timelineItem, questions }: Props) => {
  const scoreItemMap = getScoreItemLabel().map((metric) => {
    const key = metric.key as keyof InterviewQuestion;
    const avgScore = questions.length > 0 ? questions.reduce((sum, q) => sum + (q[key] as number), 0) / questions.length : 0;
    return { key: key, label: metric.label, score: avgScore };
  });
  
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FEFBED" }}>
      <View style={{ padding: 20 }}>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 20,
            padding: 24,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 2,
            alignItems: "center",
          }}
        >
          <ScoreCircle score={timelineItem.interviewScore!} size={100} />

          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#1D252C",
              marginTop: 16,
              marginBottom: 8,
            }}
          >
            Overall Interview Score
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: "#6B7280",
              textAlign: "center",
            }}
          >
            Based on {questions.length} questions analyzed
          </Text>
        </View>

        {/* Question Types Breakdown */}
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#1D252C",
              marginBottom: 16,
            }}
          >
            Question Types
          </Text>

          {Object.keys(QuestionType).map((type) => {
            const typeQuestions = questions.filter((q) => q.questionType === type);
            if (typeQuestions.length === 0) return null;
            const avgScore = typeQuestions.length > 0 ? typeQuestions.reduce((sum, q) => sum + q.score!, 0) / typeQuestions.length : 0;

            return (
              <View
                key={type}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#F3F4F6",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: getQuestionTypeColor(type as QuestionType),
                      marginRight: 12,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#1D252C",
                    }}
                  >
                    {getQuestionTypeLabel(type as QuestionType)}
                  </Text>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: getScoreColor(avgScore),
                    }}
                  >
                    {avgScore.toFixed(1)}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#9CA3AF",
                    }}
                  >
                    {typeQuestions.length} questions
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Performance Metrics */}
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 20,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#1D252C",
              marginBottom: 16,
            }}
          >
            Performance Breakdown
          </Text>

          <InterviewScoreRadar data={scoreItemMap} />

          {scoreItemMap.map((item) => (
            <View
              key={item.key}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#F3F4F6",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#1D252C",
                  flex: 1,
                }}
              >
                {item.label}
              </Text>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 60,
                    height: 6,
                    backgroundColor: "#F3F4F6",
                    borderRadius: 3,
                    marginRight: 12,
                  }}
                >
                  <View
                    style={{
                      width: `${(item.score / 10) * 100}%`,
                      height: "100%",
                      backgroundColor: getScoreColor(item.score),
                      borderRadius: 3,
                    }}
                  />
                </View>

                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: getScoreColor(item.score),
                    minWidth: 30,
                    textAlign: "right",
                  }}
                >
                  {item.score.toFixed(1)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};
