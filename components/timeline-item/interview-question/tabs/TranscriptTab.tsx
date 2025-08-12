import { MarkdownCopyView } from "@/components/misc/MarkdownCopyView";
import { TimelineItem } from "@/supabase/functions/api/types/TimelineItem";
import React from "react";
import { ScrollView, View } from "react-native";

interface Props {
  timelineItem: TimelineItem;
}

export const TranscriptTab = ({ timelineItem }: Props) => {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FEFBED" }}>
      <View style={{ marginTop: 20 }}>
        <MarkdownCopyView markdownText={timelineItem.text} />
      </View>
    </ScrollView>
  );
};
