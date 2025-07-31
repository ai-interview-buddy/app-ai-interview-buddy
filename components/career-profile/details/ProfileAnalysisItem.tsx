import { getAnalysisIcon, getAnalysisTitle, getScoreColor } from "@/lib/utils/score.utils";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  item: {
    item: string;
    score: number;
    feedback: string;
  };
};

export const ProfileAnalysisItem = ({ item }: Props) => {
  const color = getScoreColor(item.score);
  const title = getAnalysisTitle(item.item);
  const icon = getAnalysisIcon(item.item);

  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 16,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 12 }}>
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: color + "20",
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 16,
          }}
        >
          <Ionicons name={icon as any} size={20} color={color} />
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#1D252C" }}>{title}</Text>
            <View
              style={{
                backgroundColor: color + "20",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 12,
              }}
            >
              <Text style={{ color, fontWeight: "700" }}>{item.score}/10</Text>
            </View>
          </View>
          <Text style={{ fontSize: 14, color: "#6B7280", lineHeight: 20 }}>{item.feedback}</Text>
        </View>
      </View>
    </View>
  );
};
