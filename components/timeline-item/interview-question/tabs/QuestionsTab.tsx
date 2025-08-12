import { InterviewQuestion } from "@/supabase/functions/api/types/InterviewQuestion";
import { TimelineItem } from "@/supabase/functions/api/types/TimelineItem";
import { Link } from "expo-router";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import QuestionHeader from "../QuestionHeader";

interface Props {
  timelineItem: TimelineItem;
  questions: InterviewQuestion[];
}

export const QuestionsTab = ({ timelineItem, questions }: Props) => {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FEFBED" }}>
      <View style={{ padding: 20 }}>
        {questions.map((question, index) => (
          <Link href={`/job-position/${timelineItem?.positionId}/timeline/${timelineItem?.id}/${question?.id}`} key={index} push asChild>
            <TouchableOpacity key={index}>
              <QuestionHeader question={question} key={index} />
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
};
