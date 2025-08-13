import { ScoreCircle } from "@/components/misc/ScoreCircle";
import { useJobPositions } from "@/lib/api/jobPosition.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { formatDateLong } from "@/lib/utils/format.utils";
import { getScoreColor, getScoreLabel } from "@/lib/utils/score.utils";
import { TimelineItem } from "@/supabase/functions/api/types/TimelineItem";
import React, { forwardRef } from "react";
import { Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";

type InterviewListItemProps = {
  item: TimelineItem;
};

export const InterviewListItem = forwardRef<React.ComponentRef<typeof TouchableOpacity>, InterviewListItemProps & TouchableOpacityProps>(
  ({ item, ...touchableProps }, ref) => {
    const { user } = useAuthStore();

    const scoreColor = item.interviewScore ? getScoreColor(item.interviewScore) : "";
    const scoreLabel = item.interviewScore ? getScoreLabel(item.interviewScore) : "";

    const { data } = useJobPositions(user?.accessToken);
    const company = data?.find((el) => el.id === item?.positionId);
    return (
      <TouchableOpacity
        ref={ref}
        {...touchableProps}
        style={[
          {
            marginHorizontal: 20,
            marginBottom: 16,
            backgroundColor: "white",
            borderRadius: 16,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 2,
          },
          touchableProps.style,
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flex: 1, marginRight: 16 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#1D252C",
                marginBottom: 8,
              }}
              numberOfLines={2}
            >
              {company?.companyName || item.title}
            </Text>

            {company?.jobTitle && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#6B7280",
                    marginRight: 8,
                  }}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  {company?.jobTitle}
                </Text>
              </View>
            )}

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 14,
                  color: "#6B7280",
                  marginRight: 8,
                }}
              >
                {formatDateLong(item.createdAt)}
              </Text>
            </View>
          </View>
          <View style={{ alignItems: "center" }}>
            <ScoreCircle score={item.interviewScore} size={60} />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: scoreColor,
              }}
            >
              {scoreLabel}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);

InterviewListItem.displayName = "InterviewListItem";
