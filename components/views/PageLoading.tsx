import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Text, View } from "react-native";
import { MainContainer } from "../container/MainContainer";

const loadingSteps = [
  { icon: "cloud-upload-outline", text: "Connecting to our servers...", duration: 1000 },
  { icon: "lock-closed-outline", text: "Verifying your credentials...", duration: 800 },
  { icon: "server-outline", text: "Fetching the latest data...", duration: 1200 },
  { icon: "sync-outline", text: "Syncing your preferences...", duration: 900 },
  { icon: "flash-outline", text: "Optimizing performance...", duration: 1100 },
  { icon: "eye-outline", text: "Preparing your view...", duration: 950 },
  { icon: "checkmark-circle-outline", text: "Finalizing setup...", duration: 1000 },
  { icon: "hourglass-outline", text: "Processing heavy data, this may take a few minutes...", duration: 2000 },
];

export const PageLoading: React.FC = () => {
  // Animation refs
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // fade & scale in
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();

    // continuous pulse
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    pulseLoop.start();

    // continuous rotation + reset
    const rotationLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, { toValue: 1, duration: 3000, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(rotateAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    rotationLoop.start();

    // step timer
    let alive = true;
    (async () => {
      for (let i = 0; i < loadingSteps.length && alive; i++) {
        setCurrentStep(i);
        await new Promise((res) => setTimeout(res, loadingSteps[i].duration));
      }
      // stays on last step indefinitely
    })();

    return () => {
      alive = false;
      pulseLoop.stop();
      rotationLoop.stop();
    };
  }, []);

  // interpolate rotation to degrees
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <MainContainer>
      <Animated.View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 40,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <View style={{ alignItems: "center", marginBottom: 60 }}>
          {/* Outer pulse ring */}
          <Animated.View
            style={{
              position: "absolute",
              width: 200,
              height: 200,
              borderRadius: 100,
              backgroundColor: "#FFC62920",
              transform: [{ scale: pulseAnim }],
            }}
          />

          {/* Middle rotating ring + dots */}
          <Animated.View
            style={{
              position: "absolute",
              width: 160,
              height: 160,
              borderRadius: 80,
              backgroundColor: "#FFC62930",
              transform: [{ rotate: spin }],
            }}
          >
            {[0, 1, 2, 3].map((idx) => (
              <View
                key={idx}
                style={{
                  position: "absolute",
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#FFC629",
                  top: 10,
                  left: "50%",
                  marginLeft: -4,
                  transform: [{ rotate: `${idx * 90}deg` }],
                  transformOrigin: "4px 70px",
                }}
              />
            ))}
          </Animated.View>

          {/* Inner solid circle + icon */}
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "#FFC629",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name={loadingSteps[currentStep].icon as any} size={48} color="#1D252C" />
          </View>
        </View>

        {/* Step text */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: "#1D252C",
            textAlign: "center",
          }}
        >
          {loadingSteps[currentStep].text}
        </Text>
      </Animated.View>
    </MainContainer>
  );
};
