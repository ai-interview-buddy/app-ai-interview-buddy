"use client";

import { MainContainer } from "@/components/container/MainContainer";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import type React from "react";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { TabView } from "react-native-tab-view";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
    body: "Mock interviews, record real interviews, review your performance, track roles, and tailor your CVs everything in one place.",
    primaryCTA: "Get started",
    image: require("@/assets/images/onboarding/welcome.png"),
  },
  {
    title: "Practice Mock Interviews",
    body: "Sharpen your skills with AI-driven sessions. Simulate real-world scenarios and get instant feedback on your performance.",
    microcopy: "Build confidence with tailored questions and expert insights before the real deal.",
    primaryCTA: "Next",
    image: require("@/assets/images/onboarding/mock-interview.png"),
  },
  {
    title: "Record or Upload Your Interviews",
    body: "Capture your interviews either by recording directly in the app or uploading an existing file. Our AI will analyse every question, scoring areas like structure, clarity, and impact.",
    microcopy: "Review detailed feedback, drill into each answer, and save your strongest responses to build toward that deserved job.",
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
    title: "Start by signing in and then upload your CV",
    body: "You can login using your social account and then we'll scan your CV to suggest improvements.",
    primaryCTA: "Start now",
    image: require("@/assets/images/onboarding/upload-cv.png"),
  },
];

const { width } = Dimensions.get("window");

const StepIndicator = ({ isActive, isCompleted }: { isActive: boolean; isCompleted: boolean }) => {
  const widthValue = useSharedValue(isActive ? 28 : 8);

  useEffect(() => {
    widthValue.value = withSpring(isActive ? 28 : 8, {
      damping: 15,
      stiffness: 120,
    });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: widthValue.value,
    height: 4,
    backgroundColor: isActive || isCompleted ? "#FFC629" : "#E5E7EB",
    borderRadius: 4,
  }));

  return <Animated.View style={animatedStyle} />;
};

const OnboardingScreen = ({
  stepIndex,
  isActive,
  shouldAnimate,
  handleNext,
  handleSkip,
}: {
  stepIndex: number;
  isActive: boolean;
  shouldAnimate: boolean;
  handleNext: () => void;
  handleSkip: () => void;
}) => {
  const step = onboardingSteps[stepIndex];
  const hasAnimated = useSharedValue(false);

  // Animation values for entrance
  // If we should animate, start at 0 opacity and offset
  // If we shouldn't animate (e.g. going back), start at 1 and 0
  const imageOpacity = useSharedValue(shouldAnimate ? 0 : 1);
  const imageTranslateY = useSharedValue(shouldAnimate ? 30 : 0);
  const titleOpacity = useSharedValue(shouldAnimate ? 0 : 1);
  const titleTranslateY = useSharedValue(shouldAnimate ? 20 : 0);
  const bodyOpacity = useSharedValue(shouldAnimate ? 0 : 1);
  const bodyTranslateY = useSharedValue(shouldAnimate ? 20 : 0);
  const microcopyOpacity = useSharedValue(shouldAnimate ? 0 : 1);
  const microcopyTranslateY = useSharedValue(shouldAnimate ? 20 : 0);
  const ctaOpacity = useSharedValue(shouldAnimate ? 0 : 1);
  const ctaTranslateY = useSharedValue(shouldAnimate ? 20 : 0);
  const skipOpacity = useSharedValue(shouldAnimate ? 0 : 1);

  // Button press animation
  const buttonScale = useSharedValue(1);

  // Floating animation
  const floatValue = useSharedValue(0);

  // Run entrance animations when this screen becomes active
  useEffect(() => {
    if (isActive && shouldAnimate && !hasAnimated.value) {
      hasAnimated.value = true;

      // Image animation
      imageOpacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) });
      imageTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });

      // Title animation (delayed)
      setTimeout(() => {
        titleOpacity.value = withTiming(1, { duration: 400 });
        titleTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
      }, 150);

      // Body animation
      setTimeout(() => {
        bodyOpacity.value = withTiming(1, { duration: 400 });
        bodyTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
      }, 250);

      // Microcopy animation
      setTimeout(() => {
        microcopyOpacity.value = withTiming(1, { duration: 400 });
        microcopyTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
      }, 350);

      // CTA animation
      setTimeout(() => {
        ctaOpacity.value = withTiming(1, { duration: 400 });
        ctaTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
      }, 450);

      // Skip animation
      setTimeout(() => {
        skipOpacity.value = withTiming(1, { duration: 300 });
      }, 550);
    }
  }, [isActive, shouldAnimate]);

  // Continuous floating animation for the image
  useEffect(() => {
    floatValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  // Animated styles
  const imageContainerStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
    transform: [{ translateY: imageTranslateY.value + interpolate(floatValue.value, [0, 1], [0, -8]) }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const bodyStyle = useAnimatedStyle(() => ({
    opacity: bodyOpacity.value,
    transform: [{ translateY: bodyTranslateY.value }],
  }));

  const microcopyStyle = useAnimatedStyle(() => ({
    opacity: microcopyOpacity.value,
    transform: [{ translateY: microcopyTranslateY.value }],
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ translateY: ctaTranslateY.value }],
  }));

  const skipStyle = useAnimatedStyle(() => ({
    opacity: skipOpacity.value,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleButtonPressIn = () => {
    buttonScale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
  };

  const handleButtonPressOut = () => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FEFBED",
        paddingHorizontal: 24,
      }}
    >
      {/* Image Section with floating animation */}
      <View
        style={{
          flex: 4,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Animated.View style={imageContainerStyle}>
          <View
            style={{
              borderRadius: 24,
              padding: 20,
              elevation: 3,
            }}
          >
            <Image
              source={step.image}
              style={{
                width: width * 0.65,
                height: width * 0.48,
                maxHeight: 500,
                aspectRatio: 1260 / 900,
                borderRadius: 12,
              }}
              contentFit="contain"
            />
          </View>
        </Animated.View>
      </View>

      {/* Text Content Section */}
      <View style={{ flex: 3, justifyContent: "center", paddingHorizontal: 8 }}>
        {/* Title with accent line */}
        <Animated.View style={[{ alignItems: "center", marginBottom: 20 }, titleStyle]}>
          <View
            style={{
              width: 40,
              height: 4,
              backgroundColor: "#FFC629",
              borderRadius: 2,
              marginBottom: 16,
            }}
          />
          <Text
            style={{
              fontSize: 26,
              fontWeight: "800",
              color: "#1D252C",
              textAlign: "center",
              lineHeight: 34,
              letterSpacing: -0.5,
            }}
          >
            {step.title}
          </Text>
        </Animated.View>

        {/* Body text */}
        <Animated.Text
          style={[
            {
              fontSize: 15,
              color: "#4B5563",
              textAlign: "center",
              lineHeight: 24,
              marginBottom: step.microcopy ? 20 : 24,
              letterSpacing: 0.1,
            },
            bodyStyle,
          ]}
        >
          {step.body}
        </Animated.Text>

        {/* Microcopy in a subtle card */}
        {step.microcopy && (
          <Animated.View
            style={[
              {
                backgroundColor: "#FFF7DE",
                borderRadius: 12,
                paddingVertical: 14,
                paddingHorizontal: 18,
                borderLeftWidth: 3,
                borderLeftColor: "#FFC629",
              },
              microcopyStyle,
            ]}
          >
            <Text
              style={{
                fontSize: 13,
                color: "#6B7280",
                lineHeight: 20,
                fontStyle: "italic",
              }}
            >
              {step.microcopy}
            </Text>
          </Animated.View>
        )}
      </View>

      {/* CTA Section */}
      <View style={{ flex: 2, justifyContent: "flex-end", paddingBottom: 40 }}>
        <Animated.View style={ctaStyle}>
          <AnimatedPressable
            onPress={handleNext}
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
            style={[
              {
                backgroundColor: "#FFC629",
                borderRadius: 14,
                paddingVertical: 16,
                paddingHorizontal: 24,
                shadowColor: "#E3AA1F",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.35,
                shadowRadius: 12,
                elevation: 5,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              },
              buttonAnimatedStyle,
            ]}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#1D252C",
                textAlign: "center",
                letterSpacing: 0.3,
              }}
            >
              {step.primaryCTA}
            </Text>
            {stepIndex === onboardingSteps.length - 1 ? (
              <Ionicons name="sparkles" size={18} color="#1D252C" style={{ marginLeft: 8 }} />
            ) : (
              <Ionicons name="arrow-forward" size={18} color="#1D252C" style={{ marginLeft: 8 }} />
            )}
          </AnimatedPressable>
        </Animated.View>

        {stepIndex < onboardingSteps.length - 1 && (
          <Animated.View style={skipStyle}>
            <Pressable
              onPress={handleSkip}
              style={{
                paddingVertical: 14,
                paddingHorizontal: 24,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "500",
                  color: "#9CA3AF",
                  textAlign: "center",
                  letterSpacing: 0.2,
                }}
              >
                Skip for now
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const OnboardingWizard: React.FC = () => {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "step0", title: "Welcome" },
    { key: "step1", title: "Mock Interviews" },
    { key: "step2", title: "Real Interviews" },
    { key: "step3", title: "Job Positions" },
    { key: "step4", title: "Career Track" },
    { key: "step5", title: "Activate" },
  ]);

  const handleSkip = () => router.replace("/auth");

  const handleIndexChange = (newIndex: number) => {
    setIndex(newIndex);
  };

  const handleNext = async () => {
    if (index < routes.length - 1) {
      handleIndexChange(index + 1);
    } else {
      handleSkip();
    }
  };

  const renderTabBar = () => {
    return (
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 8,
          backgroundColor: "#FEFBED",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {routes.map((_, i) => (
            <StepIndicator key={i} isActive={i === index} isCompleted={i < index} />
          ))}
        </View>
      </View>
    );
  };

  const renderScene = ({ route }: { route: { key: string } }) => {
    const stepIndex = routes.findIndex((r) => r.key === route.key);
    // Future steps or current step should animate if they haven't yet
    // Past steps should just stay fully visible
    const shouldAnimate = stepIndex >= index;

    return (
      <OnboardingScreen
        stepIndex={stepIndex}
        isActive={index === stepIndex}
        shouldAnimate={shouldAnimate}
        handleNext={handleNext}
        handleSkip={handleSkip}
      />
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MainContainer>
        <TabView
          lazy
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={handleIndexChange}
          initialLayout={{ width }}
          renderTabBar={renderTabBar}
        />
      </MainContainer>
    </>
  );
};

export default OnboardingWizard;
