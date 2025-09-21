import { formatDateLong } from "@/lib/utils/format.utils";
import { TimelineItem, TimelineType } from "@/supabase/functions/api/types/TimelineItem";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { default as React } from "react";
import { Text, View } from "react-native";

interface Props {
  timelineItem: TimelineItem;
  bgColor: string;
}

// TODO: not used yet

export const TimelineItemList = ({ timelineItem, bgColor }: Props) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
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
        {timelineItem.type === TimelineType.COVER_LETTER ? (
          <Ionicons name="mail-open" size={24} color="white" />
        ) : timelineItem.type === TimelineType.NOTE ? (
          <Ionicons name="document-text" size={24} color="white" />
        ) : (
          <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>=/</Text>
        )}
      </View>

      {/* Stage Content */}
      <Link href={`/job-position/${timelineItem.positionId}/timeline/${timelineItem.id}`} asChild push>
        <View
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
                backgroundColor: bgColor + "20",
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
                {timelineItem.type}
              </Text>
            </View>
          </View>

          {timelineItem.interviewInstructions && (
            <Text
              style={{
                fontSize: 14,
                color: "#6B7280",
                lineHeight: 20,
                marginBottom: 12,
              }}
            >
              {timelineItem.interviewInstructions}
            </Text>
          )}

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              {timelineItem.interviewInterviewerName && (
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#1D252C",
                  }}
                >
                  {timelineItem.interviewInterviewerName}
                </Text>
              )}
              {timelineItem.interviewScheduledDate && (
                <Text
                  style={{
                    fontSize: 12,
                    color: "#9CA3AF",
                  }}
                >
                  {formatDateLong(timelineItem.interviewScheduledDate)}
                </Text>
              )}
            </View>

            {timelineItem.interviewScore && (
              <View
                style={{
                  backgroundColor: "#FFF7DE",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#E3AA1F",
                  }}
                >
                  {timelineItem.interviewScore}/100
                </Text>
              </View>
            )}
          </View>
        </View>
      </Link>
    </View>
  );
};
