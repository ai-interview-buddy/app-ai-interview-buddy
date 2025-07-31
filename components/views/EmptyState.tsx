import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface Props {
  title: string;
  children: React.ReactNode;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const EmptyState = ({ title, children, icon = "person-outline" }: Props) => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
      minHeight: 400,
    }}
  >
    <View
      style={{
        width: 120,
        height: 120,
        backgroundColor: "#FFF7DE",
        borderRadius: 60,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 32,
      }}
    >
      {icon && <Ionicons name={icon} size={48} color="#E3AA1F" />}
    </View>

    <Text
      style={{
        fontSize: 24,
        fontWeight: "700",
        color: "#1D252C",
        textAlign: "center",
        marginBottom: 12,
      }}
    >
      {title}
    </Text>

    <Text
      style={{
        fontSize: 16,
        color: "#6B7280",
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 32,
      }}
    >
      {children}
    </Text>
  </View>
);
