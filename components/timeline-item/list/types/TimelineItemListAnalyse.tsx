import { formatDateLong } from "@/lib/utils/format.utils";
import { TimelineItem } from "@/supabase/functions/api/types/TimelineItem";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { default as React } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  timelineItem: TimelineItem;
  bgColor: string;
}

export const TimelineItemListAnalyse = ({ timelineItem, bgColor }: Props) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", width: "100%" }}>
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
        <Ionicons name="speedometer-outline" size={24} color="white" />
      </View>

      {/* Stage Content */}
      <Link href={`/job-position/${timelineItem.positionId}/timeline/${timelineItem.id}`} asChild push>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.02,
            shadowRadius: 4,
            elevation: 1,
          }}
        >
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
                  Feedback
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
                {timelineItem.createdAt && (
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#9CA3AF",
                    }}
                  >
                    {formatDateLong(timelineItem.createdAt)}
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
                    {timelineItem.interviewScore}/10
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
};
