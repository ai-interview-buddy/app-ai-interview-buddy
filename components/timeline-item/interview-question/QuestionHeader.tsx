import { getQuestionTypeColor, getQuestionTypeLabel, getScoreItemLabel } from "@/lib/utils/questionType.utils";
import { getScoreColor } from "@/lib/utils/score.utils";
import { InterviewQuestion } from "@/supabase/functions/api/types/InterviewQuestion";
import React from "react";
import { Text, View } from "react-native";

type QuestionRowProps = {
  question: InterviewQuestion;
};

export default function QuestionHeader({ question }: QuestionRowProps) {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
      }}
    >
      {/* Question Header */}

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        {/* Left side */}
        <View style={{ flex: 1, marginRight: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: "#9CA3AF",
                marginRight: 8,
              }}
            >
              Q{question.questionNumber}
            </Text>

            <View
              style={{
                backgroundColor: getQuestionTypeColor(question.questionType) + "20",
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "600",
                  color: getQuestionTypeColor(question.questionType),
                  textTransform: "uppercase",
                }}
              >
                {getQuestionTypeLabel(question.questionType)}
              </Text>
            </View>
          </View>

          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#1D252C",
              lineHeight: 22,
            }}
          >
            {question.questionTitle}
          </Text>
        </View>

        {/* Right side - Score */}
        <View
          style={{
            backgroundColor: getScoreColor(question.score || 0) + "20",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: getScoreColor(question.score || 0),
            }}
          >
            {question.score}
          </Text>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: getScoreColor(question.score || 0),
            }}
          >
            /10
          </Text>
        </View>
      </View>

      {/* Metrics Grid */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 12,
          gap: 8,
        }}
      >
        {getScoreItemLabel()
          .map((metric) => {
            const key = metric.key as keyof InterviewQuestion;
            return { key: key, label: metric.label, score: question[key] as number };
          })
          .map((metric) => (
            <View
              key={metric.key}
              style={{
                backgroundColor: "#F8F9FA",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "500",
                  color: "#6B7280",
                  marginRight: 4,
                }}
              >
                {metric.label}:
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  color: getScoreColor(metric.score),
                }}
              >
                {metric.score}
              </Text>
            </View>
          ))}
      </View>
    </View>
  );
}
