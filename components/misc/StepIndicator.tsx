import React from "react";
import { Text, View } from "react-native";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 32,
      }}
    >
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <React.Fragment key={step}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: currentStep >= step ? "#FFC629" : "#F3F4F6",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: currentStep >= step ? "#1D252C" : "#9CA3AF",
              }}
            >
              {step}
            </Text>
          </View>
          {step < totalSteps && (
            <View
              style={{
                width: 40,
                height: 2,
                backgroundColor: currentStep > step ? "#FFC629" : "#F3F4F6",
                marginHorizontal: 8,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};
