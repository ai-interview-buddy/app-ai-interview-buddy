import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export const TipsSection: React.FC = () => {
  const tips = [
    "• Find a quiet space",
    "• Speak clearly and naturally",
    "• Keep your device close but not too close",
    "• Take time to think before responding",
    "• Use the STAR method for behavioral questions",
  ];

  return (
    <View
      style={{
        backgroundColor: "white",
        width: "100%",
        borderRadius: 16,
        padding: 20,
        marginTop: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <Ionicons name="bulb" size={20} color="#FFC629" style={{ marginRight: 12, marginTop: 2 }} />
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "#1D252C",
          }}
        >
          Quick Tips
        </Text>
      </View>

      <Text
        style={{
          fontSize: 14,
          color: "#6B7280",
          lineHeight: 20,
        }}
      >
        {tips.join("\n")}
      </Text>
    </View>
  );
};
