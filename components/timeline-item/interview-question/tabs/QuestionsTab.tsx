import { EmptyState } from "@/components/views/EmptyState";
import { InterviewQuestion } from "@/supabase/functions/api/types/InterviewQuestion";
import { TimelineItem } from "@/supabase/functions/api/types/TimelineItem";
import { Href, Link } from "expo-router";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import QuestionHeader from "../QuestionHeader";

interface Props {
  timelineItem: TimelineItem;
  questions: InterviewQuestion[];
  linkType: "job-position" | "interview";
}

export const QuestionsTab = ({ timelineItem, questions, linkType }: Props) => {
  const isEmpty = questions.length === 0;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FEFBED" }}>
      <View style={{ padding: 20 }}>
        {isEmpty && (
          <EmptyState title="No Questions" icon="help-circle-outline">
            It&apos;s possible your recording has failed, or, the interview didn&apos;t have the structure of Quenstions &amp; Answers.
          </EmptyState>
        )}

        {!isEmpty &&
          questions.map((question, index) => {
            const href: Href =
              linkType === "job-position"
                ? `/job-position/${timelineItem?.positionId}/timeline/${timelineItem?.id}/${question?.id}`
                : `/interview/${timelineItem?.id}/${question?.id}`;
            return (
              <Link href={href} key={index} push asChild>
                <TouchableOpacity key={index}>
                  <QuestionHeader question={question} key={index} />
                </TouchableOpacity>
              </Link>
            );
          })}
      </View>
    </ScrollView>
  );
};
