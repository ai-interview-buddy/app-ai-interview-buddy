import React from "react";
import { Text, View } from "react-native";

type TitleListHeader = {
  title: string;
  info?: string;
};

export const TitleListHeader = ({ title, info }: TitleListHeader) => {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 0,
      }}
    >
      <Text
        style={{
          fontSize: 32,
          fontWeight: "800",
          color: "#1D252C",
          marginBottom: 8,
        }}
      >
        {title}
      </Text>

      {info && (
        <Text
          style={{
            fontSize: 16,
            color: "#6B7280",
            marginBottom: 24,
            fontWeight: "500",
          }}
        >
          {info}
        </Text>
      )}
    </View>
  );
};
