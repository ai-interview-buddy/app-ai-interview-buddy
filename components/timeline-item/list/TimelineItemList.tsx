import { TimelineItem, TimelineType, isInterviewAnalyseType } from "@/supabase/functions/api/types/TimelineItem";
import { default as React } from "react";
import { View } from "react-native";
import { TimelineItemListAnalyse } from "./types/TimelineItemListAnalyse";
import { TimelineItemListSimple } from "./types/TimelineItemListSimple";

const getStatusColor = (type: TimelineType) => {
  switch (type) {
    case "COVER_LETTER":
      return "#8B5CF6";
    case "LINKEDIN_INTRO":
      return "#3B82F6";
    case "NOTE":
      return "#9CA3AF";
    case "REPLY_EMAIL":
      return "#F59E0B";
    case "CV_ANALYSE":
      return "#F59E0B";
    case "INTERVIEW_STEP":
      return "#EF4444";
    case "INTERVIEW_ANALYSE":
    case "MOCK_ANALYSE":
      return "#10B981";
    default:
      return "#9CA3AF";
  }
};

interface Props {
  timelineItem: TimelineItem;
}

export const TimelineItemList = ({ timelineItem }: Props) => {
  const bgColor = getStatusColor(timelineItem.type);
  const isSimple =
    timelineItem.type === TimelineType.COVER_LETTER ||
    timelineItem.type === TimelineType.NOTE ||
    timelineItem.type === TimelineType.REPLY_EMAIL ||
    timelineItem.type === TimelineType.LINKEDIN_INTRO;

  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
      {isSimple && <TimelineItemListSimple timelineItem={timelineItem} bgColor={bgColor} />}
      {isInterviewAnalyseType(timelineItem.type) && <TimelineItemListAnalyse timelineItem={timelineItem} bgColor={bgColor} />}
    </View>
  );
};
