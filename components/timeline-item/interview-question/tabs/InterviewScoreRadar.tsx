import React from "react";
import { RadarChart } from "react-native-gifted-charts";

type ScoreItem = { key: string; label: string; score: number };

type Props = {
  data: ScoreItem[];
  max?: number;
  sections?: number;
};

export default function InterviewScoreRadar({ data, max = 10, sections = 5 }: Props) {
  const Secondary = "#1D252C";
  const Honey = "#E3AA1F";

  const values = data.map((d) => d.score);
  const labels = data.map((d) => d.label.split(" ")[0]);

  return (
    <RadarChart
      data={values}
      labels={labels}
      maxValue={max}
      noOfSections={sections}
      labelConfig={{ stroke: Secondary, fontWeight: "bold" }}
      polygonConfig={{
        stroke: "rgba(255,198,41,0.25)",
        fill: Honey,
      }}
    />
  );
}
