import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, ScrollView, Text, TouchableOpacity, View } from "react-native";
export interface InterviewActiveAnimationProps {
  currentQuestion: string;
  isAISpeaking: boolean;
  handleEndInterview: () => void;
}

export const InterviewActiveAnimation: React.FC<InterviewActiveAnimationProps> = ({
  currentQuestion,
  isAISpeaking,
  handleEndInterview,
}) => {
  // Animation refs
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim1 = useRef(new Animated.Value(0)).current;
  const waveAnim2 = useRef(new Animated.Value(0)).current;
  const waveAnim3 = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Continuous animation
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    const createWaveAnimation = (waveAnim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(waveAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

    pulseAnimation.start();
    const w1 = createWaveAnimation(waveAnim1, 0);
    const w2 = createWaveAnimation(waveAnim2, 500);
    const w3 = createWaveAnimation(waveAnim3, 1000);
    w1.start();
    w2.start();
    w3.start();

    return () => {
      pulseAnimation.stop();
      w1.stop();
      w2.stop();
      w3.stop();
    };
  }, []);

  const wave1Scale = waveAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.4],
  });

  const wave2Scale = waveAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.6],
  });

  const wave3Scale = waveAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.8],
  });

  const wave1Opacity = waveAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0],
  });

  const wave2Opacity = waveAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0],
  });

  const wave3Opacity = waveAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0],
  });

  return (
    <>
      <ScrollView contentContainerStyle={{ flex: 1, paddingHorizontal: 20 }}>
        {/* Visual Indicator Container */}
        <View style={{ alignItems: "center", marginVertical: 40 }}>
          {/* Animated Waves */}
          <Animated.View
            style={{
              position: "absolute",
              width: 300,
              height: 300,
              borderRadius: 150,
              backgroundColor: "#FFC629",
              opacity: wave3Opacity,
              transform: [{ scale: wave3Scale }],
            }}
          />

          <Animated.View
            style={{
              position: "absolute",
              width: 250,
              height: 250,
              borderRadius: 125,
              backgroundColor: "#FFC629",
              opacity: wave2Opacity,
              transform: [{ scale: wave2Scale }],
            }}
          />

          <Animated.View
            style={{
              position: "absolute",
              width: 200,
              height: 200,
              borderRadius: 100,
              backgroundColor: "#FFC629",
              opacity: wave1Opacity,
              transform: [{ scale: wave1Scale }],
            }}
          />

          {/* Main Indicator */}
          <Animated.View
            style={{
              transform: [{ scale: pulseAnim }],
            }}
          >
            <View
              style={{
                width: 160,
                height: 160,
                borderRadius: 80,
                backgroundColor: isAISpeaking ? "#34D399" : "#60A5FA",
                justifyContent: "center",
                alignItems: "center",
                shadowColor: isAISpeaking ? "#34D399" : "#60A5FA",
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.4,
                shadowRadius: 20,
                elevation: 12,
              }}
            >
              <Ionicons name={isAISpeaking ? "volume-high" : "mic"} size={60} color="white" />
              <Text style={{ color: "white", paddingTop: 10, fontSize: 12 }}>{isAISpeaking ? "AI is speaking..." : "Listening..."}</Text>
            </View>
          </Animated.View>
        </View>

        {/* Current Question Card */}
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
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
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <View
              style={{
                backgroundColor: "#FFF7DE",
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
                marginRight: 8,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: "600", color: "#E3AA1F" }}>Transcript</Text>
            </View>
          </View>
          <Text style={{ fontSize: 16, color: "#1D252C", lineHeight: 24 }}>{currentQuestion || "Waiting for AI..."}</Text>
        </View>
      </ScrollView>

      {/* End Interview Button */}
      <TouchableOpacity
        onPress={handleEndInterview}
        style={{
          backgroundColor: "white",
          borderRadius: 16,
          paddingVertical: 14,
          marginHorizontal: 20,
          marginTop: 5,
          marginBottom: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: "#E5E7EB",
        }}
      >
        <Ionicons name="stop-circle-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#EF4444" }}>End Interview</Text>
      </TouchableOpacity>
    </>
  );
};
