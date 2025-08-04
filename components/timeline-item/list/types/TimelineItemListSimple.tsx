import { TimelineItem, TimelineType } from "@/supabase/functions/api/types/TimelineItem";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { default as React } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  timelineItem: TimelineItem;
  bgColor: string;
}

export const TimelineItemListSimple = ({ timelineItem, bgColor }: Props) => {
  const icon =
    timelineItem.type === TimelineType.COVER_LETTER
      ? "mail-open"
      : timelineItem.type === TimelineType.NOTE
      ? "document-text"
      : timelineItem.type === TimelineType.LINKEDIN_INTRO
      ? "logo-linkedin"
      : timelineItem.type === TimelineType.REPLY_EMAIL
      ? "mail-outline"
      : "logo-ionic";

  const tagLabel =
    timelineItem.type === TimelineType.COVER_LETTER
      ? "Cover Letter"
      : timelineItem.type === TimelineType.NOTE
      ? "Note"
      : timelineItem.type === TimelineType.LINKEDIN_INTRO
      ? "LinkedIn Intro"
      : timelineItem.type === TimelineType.REPLY_EMAIL
      ? "Email Reply"
      : "";

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      {/* Timeline Dot */}
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: bgColor,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 16,
          zIndex: 1,
        }}
      >
        <Ionicons name={icon as any} size={24} color="white" />
      </View>

      {/* Stage Content */}
      <Link href={`/job-position/${timelineItem.positionId}/timeline/${timelineItem.id}`} asChild push>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: 16,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.02,
            shadowRadius: 4,
            elevation: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#1D252C",
                flex: 1,
              }}
            >
              {timelineItem.title}
            </Text>
            <View
              style={{
                backgroundColor: `${bgColor}20`,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "600",
                  color: bgColor,
                  textTransform: "uppercase",
                }}
              >
                {tagLabel}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
};
