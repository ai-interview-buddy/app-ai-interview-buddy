import React from "react";
import { Text, View } from "react-native";
import { ProfileAnalysisItem } from "./ProfileAnalysisItem";

type AnalysisItem = {
  item: string;
  score: number;
  feedback: string;
};

type Props = {
  items: string; // stringified JSON
};

export const ProfileAnalysisList = ({ items }: Props) => {
  let parsed: AnalysisItem[] = [];

  try {
    parsed = JSON.parse(items);
  } catch (e) {
    console.error("Invalid JSON in curriculumAnalyse", e);
  }

  if (!parsed.length) return null;

  return (
    <View style={{ marginBottom: 40 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "700",
          color: "#1D252C",
          marginHorizontal: 20,
          marginBottom: 20,
        }}
      >
        Detailed Analysis
      </Text>

      {parsed.map((item, index) => (
        <ProfileAnalysisItem key={index} item={item} />
      ))}
    </View>
  );
};
