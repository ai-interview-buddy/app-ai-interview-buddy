import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { TipsSection } from "../misc/TipsSection";

export const InterviewGeneratingView: React.FC = () => {
  const sparkleRotation = useSharedValue(0);
  const stepRotation = useSharedValue(0);
  const [currentStep, setCurrentStep] = React.useState(0);

  useEffect(() => {
    sparkleRotation.value = withRepeat(
      withTiming(360, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    stepRotation.value = withRepeat(
      withTiming(360, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 1000);
    const timer2 = setTimeout(() => setCurrentStep(2), 2000);
    const timer3 = setTimeout(() => setCurrentStep(3), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));

  const stepAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${stepRotation.value}deg` }],
  }));

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1, justifyContent: "flex-start", alignItems: "center", paddingHorizontal: 20, marginBottom: 40 }}
    >
      <Animated.View
        style={[
          {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: "#FFF7DE",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 32,
          },
          sparkleAnimatedStyle,
        ]}
      >
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "#FFC629",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="sparkles" size={40} color="white" />
        </View>
      </Animated.View>

      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          color: "#1D252C",
          marginBottom: 12,
          textAlign: "center",
        }}
      >
        Preparing Your Interview
      </Text>

      <Text
        style={{
          fontSize: 16,
          color: "#6B7280",
          textAlign: "center",
          lineHeight: 24,
          marginBottom: 40,
        }}
      >
        Our AI is crafting personalized questions based on your profile and the role requirements...
      </Text>

      {/* Loading Progress Indicators */}
      <View style={{ width: "100%", gap: 12 }}>
        {["Analyzing your career profile", "Generating interview questions", "Setting up interview session"].map((text, index) => {
          const stepIndex = index + 1;
          const isDone = currentStep > stepIndex;
          const isActive = currentStep === stepIndex;
          const isPending = currentStep < stepIndex;

          return (
            <View
              key={text}
              style={{
                backgroundColor: "white",
                borderRadius: 12,
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                opacity: isPending ? 0.5 : 1,
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: isDone ? "#34D399" : isActive ? "#FFC629" : "#E5E7EB",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                {isDone ? (
                  <Ionicons name="checkmark" size={16} color="white" />
                ) : isActive ? (
                  <Animated.View style={stepAnimatedStyle}>
                    <Ionicons name="sync" size={14} color="white" />
                  </Animated.View>
                ) : null}
              </View>
              <Text style={{ fontSize: 14, color: "#6B7280" }}>{text}</Text>
            </View>
          );
        })}
      </View>

      {/* Tips Section */}
      <TipsSection />
    </ScrollView>
  );
};
