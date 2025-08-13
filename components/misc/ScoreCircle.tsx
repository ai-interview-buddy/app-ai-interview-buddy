import { getScoreColor } from "@/lib/utils/score.utils";
import React from "react";
import { Text, View } from "react-native";

type ScoreCircleProps = {
  score?: number;
  size?: number; // Outer diameter (default 100)
};

export const ScoreCircle = ({ score, size = 100 }: ScoreCircleProps) => {
  const innerSize = size * 0.88;
  const borderWidth = size * 0.06;
  const trackColor = "#F3F4F6";
  const color = getScoreColor(score);
  const rotate = "-90deg";

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color + "20",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Inner base circle */}
      <View
        style={{
          position: "absolute",
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          borderWidth,
          borderColor: trackColor,
        }}
      />

      {/* Progress layer */}
      <View
        style={{
          position: "absolute",
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          borderWidth,
          borderColor: color,
          borderTopColor: "transparent",
          borderRightColor: (score || 0) < 2.5 ? "transparent" : color,
          borderBottomColor: (score || 0) < 5 ? "transparent" : color,
          borderLeftColor: (score || 0) < 7.5 ? "transparent" : color,
          transform: [{ rotate }],
        }}
      />

      {/* Score Text */}
      <Text
        style={{
          fontSize: size * 0.25,
          fontWeight: "800",
          color,
        }}
      >
        {score}
      </Text>
    </View>
  );
};
