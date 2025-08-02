import React from "react";
import { Text, View } from "react-native";

type CenteredTextHeadingProps = {
  title: string;
  subtitle?: string;
};

export const CenteredTextHeading = ({ title, subtitle }: CenteredTextHeadingProps) => {
  return (
    <View style={{ marginTop: 24, marginBottom: 32 }}>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "800",
          color: "#1D252C",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        {title}
      </Text>

      {subtitle && (
        <Text
          style={{
            fontSize: 16,
            color: "#6B7280",
            textAlign: "center",
            lineHeight: 24,
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
};
