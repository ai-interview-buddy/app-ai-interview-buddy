"use client";

import { MainContainer } from "@/components/container/MainContainer";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import type React from "react";
import { useState } from "react";
import { Animated, Dimensions, Text, TouchableOpacity, View } from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";

type OnboardingStep = {
  title: string;
  body: string;
  microcopy?: string;
  primaryCTA: string;
  image: any;
};

const onboardingSteps: OnboardingStep[] = [
  {
    title: "Nail your next interview",
    body: "Record interviews, review your performance, track roles, and tailor your CVs everything in one place.",
    primaryCTA: "Get started",
    image: require("@/assets/images/onboarding/welcome.png"),
  },
  {
    title: "Record or Upload Your Interviews",
    body: "Capture your interviews either by recording directly in the app or uploading an existing file. Our AI will analyse every question, scoring areas like structure, clarity, and impact.",
    microcopy: "Review detailed feedback, drill into each answer, and save your strongest responses to build get that deserved job.",
    primaryCTA: "Next",
    image: require("@/assets/images/onboarding/record-interview.png"),
  },
  {
    title: "Track Job Positions in seconds",
    body: "Paste a job listing URL (or the job description) and we'll auto-capture company, title, salary, and key skills for you.",
    microcopy: "Generate cover letters, answer to emails, record expected salary, add notes and keep everything organised.",
    primaryCTA: "Next",
    image: require("@/assets/images/onboarding/job-position.png"),
  },
  {
    title: "Tailor your path",
    body: "Carrer profile allows you to keep multiple CVs (eg. Backend Engineer and Lead Engineer) and match each to the right role.",
    microcopy: "Switch profiles when applying to highlight the most relevant wins.",
    primaryCTA: "Next",
    image: require("@/assets/images/onboarding/career-track.png"),
  },
  {
    title: "Start by sign in and then upload your CV",
    body: "You can login using your social account and then we'll scan your CV to suggest improvements.",
    primaryCTA: "Start now",
    image: require("@/assets/images/onboarding/upload-cv.png"),
  },
];

const { width } = Dimensions.get("window");

const OnboardingWizard: React.FC = () => {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "step0", title: "Welcome" },
    { key: "step1", title: "Interviews" },
    { key: "step2", title: "Job Positions" },
    { key: "step3", title: "Career Track" },
    { key: "step4", title: "Activate" },
  ]);

  const handleSkip = () => router.replace("/auth");

  const handleNext = async () => {
    if (index < routes.length - 1) {
      setIndex(index + 1);
    } else {
      handleSkip();
    }
  };

  const renderTabBar = () => {
    const progressWidth = (index / (routes.length - 1)) * 100;

    return (
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor: "#FEFBED",
        }}
      >
        <View
          style={{
            height: 4,
            backgroundColor: "#F3F4F6",
            borderRadius: 2,
            marginBottom: 12,
          }}
        >
          <Animated.View
            style={{
              height: "100%",
              width: `${progressWidth}%`,
              backgroundColor: "#FFC629",
              borderRadius: 2,
            }}
          />
        </View>
      </View>
    );
  };

  const OnboardingScreen = ({ stepIndex }: { stepIndex: number }) => {
    const step = onboardingSteps[stepIndex];

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#FEFBED",
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            flex: 4,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={step.image}
            style={{
              width: width * 0.7,
              height: width * 0.5,
              maxHeight: 500,
              aspectRatio: 1260 / 900,
              borderRadius: 16,
            }}
            contentFit="contain"
          />
        </View>

        <View style={{ flex: 3, justifyContent: "center" }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "800",
              color: "#1D252C",
              textAlign: "center",
              marginBottom: 16,
              lineHeight: 36,
            }}
          >
            {step.title}
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: "#6B7280",
              textAlign: "center",
              lineHeight: 24,
              marginBottom: step.microcopy ? 16 : 32,
            }}
          >
            {step.body}
          </Text>

          {step.microcopy && (
            <Text
              style={{
                fontSize: 14,
                color: "#9CA3AF",
                textAlign: "center",
                lineHeight: 20,
                fontStyle: "italic",
              }}
            >
              {step.microcopy}
            </Text>
          )}
        </View>

        <View style={{ flex: 2, justifyContent: "flex-end", paddingBottom: 40 }}>
          <TouchableOpacity
            onPress={handleNext}
            style={{
              backgroundColor: "#FFC629",
              borderRadius: 16,
              paddingVertical: 18,
              paddingHorizontal: 24,
              shadowColor: "#FFC629",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#1D252C",
                textAlign: "center",
              }}
            >
              {step.primaryCTA}
              {stepIndex === onboardingSteps.length - 1 && (
                <>
                  {" "}
                  <Ionicons name="sparkles-outline" size={18} />
                </>
              )}
            </Text>
          </TouchableOpacity>
          {stepIndex < onboardingSteps.length - 1 && (
            <TouchableOpacity
              onPress={handleSkip}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#9CA3AF",
                  textAlign: "center",
                }}
              >
                Skip
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderScene = SceneMap({
    step0: () => <OnboardingScreen stepIndex={0} />,
    step1: () => <OnboardingScreen stepIndex={1} />,
    step2: () => <OnboardingScreen stepIndex={2} />,
    step3: () => <OnboardingScreen stepIndex={3} />,
    step4: () => <OnboardingScreen stepIndex={4} />,
  });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MainContainer>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width }}
          renderTabBar={renderTabBar}
        />
      </MainContainer>
    </>
  );
};

export default OnboardingWizard;
