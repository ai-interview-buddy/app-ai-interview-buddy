import { ScoreCircle } from "@/components/misc/ScoreCircle";
import { getScoreColor, getScoreLabel } from "@/lib/utils/score.utils";
import { CareerProfile } from "@/supabase/functions/api/types/CareerProfile";
import React, { forwardRef } from "react";
import { Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";

type ProfileListItemProps = {
  item: CareerProfile;
};

export const ProfileListItem = forwardRef<React.ComponentRef<typeof TouchableOpacity>, ProfileListItemProps & TouchableOpacityProps>(
  ({ item, ...touchableProps }, ref) => {
    const scoreColor = getScoreColor(item.curriculumScore);
    const scoreLabel = getScoreLabel(item.curriculumScore);

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
              {item.title}
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 14,
                  color: "#6B7280",
                  marginRight: 8,
                }}
              >
                Curriculum Score:
              </Text>
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

          <ScoreCircle score={item.curriculumScore} size={60} />
        </View>
      </TouchableOpacity>
    );
  }
);

ProfileListItem.displayName = "ProfileListItem";
