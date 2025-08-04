import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";

type LightHeaderProps = {
  title: string;
  style?: StyleProp<TextStyle>;
};

export const LightHeader = ({ title, style }: LightHeaderProps) => {
  return (
    <Text
      style={StyleSheet.flatten([
        style,
        {
          fontSize: 18,
          fontWeight: "700",
          color: "#1D252C",
          marginBottom: 16,
        },
      ])}
    >
      {title}
    </Text>
  );
};
