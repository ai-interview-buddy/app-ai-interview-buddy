import { LightHeader } from "@/components/headers/LightHeader";
import QuestionHeader from "@/components/timeline-item/interview-question/QuestionHeader";
import { PageLoading } from "@/components/views/PageLoading";
import { useInterviewQuestion } from "@/lib/api/interviewQuestion.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { formatTime } from "@/lib/utils/format.utils";
import { getSentimentColor } from "@/lib/utils/questionType.utils";
import { DeepgramParagraph, QuestionFormat } from "@/supabase/functions/api/types/InterviewQuestion";
import { Clock, User } from "lucide-react-native";
import { default as React } from "react";
import { ScrollView, Text, View } from "react-native";

type Props = {
  questionId: string;
};

export const QuestionDetailContainer = ({ questionId }: Props) => {
  const { user } = useAuthStore();

  const { data: record, isLoading, error } = useInterviewQuestion(user?.accessToken, questionId as string);

  if (isLoading || !record) {
    return <PageLoading />;
  }

  const questionParsed: DeepgramParagraph[] = record.questionFormat === QuestionFormat.DEEPGRAM ? JSON.parse(record.questionJson) : {};

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FEFBED" }}>
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 20,
          marginBottom: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 2,
          alignItems: "center",
          marginHorizontal: 20,
        }}
      >
        <QuestionHeader question={record} />
      </View>

      {/* Feedback Section */}
      <LightHeader title="Answer Feedback" style={{ marginHorizontal: 20 }} />
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
          marginHorizontal: 20,
        }}
      >
        <View className="bg-gray-50 p-4 rounded-xl">
          <Text className="text-base text-[#1D252C] leading-6">{record.feedback}</Text>
        </View>
      </View>

      {/* Dialog Section */}
      <LightHeader title="Conversation" style={{ marginHorizontal: 20 }} />
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
          marginHorizontal: 20,
        }}
      >
        {questionParsed.map((segment: DeepgramParagraph, segmentIndex: number) => (
          <View key={segmentIndex} className="">
            {/* Speaker Header */}
            <View className="flex-row items-center mb-3">
              <View className="flex-row items-center flex-1">
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center ${segment.speaker > 1 ? "bg-blue-100" : "bg-[#FFC629]"}`}
                >
                  <User size={16} color={segment.speaker > 1 ? "#3B82F6" : "#1D252C"} />
                </View>
                <Text className="text-sm font-medium text-[#1D252C] ml-2">Speaker {segment.speaker}</Text>
              </View>

              <View className="flex-row items-center">
                <Clock size={14} color="#6B7280" />
                <Text className="text-xs text-gray-500 ml-1">
                  {formatTime(segment.start)} - {formatTime(segment.end)}
                </Text>
              </View>
            </View>

            {/* Sentences */}
            <View className="ml-10">
              {segment.sentences.map((sentence, sentenceIndex) => (
                <View key={sentenceIndex} className="mb-2">
                  <View className="flex-row items-center mt-1">
                    <View className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: getSentimentColor(segment.sentiment) }} />
                    <Text className="text-xs text-gray-500 capitalize">{segment.sentiment}</Text>
                  </View>
                  <Text className="text-base text-[#1D252C] leading-6">{sentence.text}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
