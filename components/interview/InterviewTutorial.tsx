import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import type React from "react";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { TabView } from "react-native-tab-view";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ComparisonRow = {
  label: string;
  mock: string;
  real: string;
};

type TutorialStep = {
  title: string;
  body: string;
  microcopy?: string;
  primaryCTA: string;
  image?: any;
  icon?: keyof typeof Ionicons.glyphMap;
  comparisonTable?: ComparisonRow[];
};

const comparisonData: ComparisonRow[] = [
  {
    label: "Who interviews you",
    mock: "AI acts as interviewer",
    real: "Your real interviewer",
  },
  {
    label: "When to use",
    mock: "Before the interview, to practice",
    real: "During the interview",
  },
  {
    label: "How it works",
    mock: "Live voice conversation with AI",
    real: "Record live or upload a recording",
  },
  {
    label: "What you get",
    mock: "Practice + instant AI feedback",
    real: "AI analysis of your real performance",
  },
];

const tutorialSteps: TutorialStep[] = [
  {
    title: "Mock Interview VS Real Interview",
    body: "We offer two distinct interview modes, each designed for a different stage of your preparation.",
    primaryCTA: "Tell me more",
    image: require("@/assets/images/onboarding/interview-types.png"),
    comparisonTable: comparisonData,
  },
  {
    title: "Mock Interview",
    body: "It's you and the AI, face to face. The AI acts as your interviewer, asking you real-world questions based on the role you're targeting. You answer out loud, and get instant structured feedback.",
    microcopy: "Think of it as a practice session: no real interviewer is involved. It's your safe space to rehearse.",
    primaryCTA: "Got it, next",
    image: require("@/assets/images/onboarding/mock-interview.png"),
    icon: "school-outline",
  },
  {
    title: "Real Interview",
    body: "This is for your actual interviews with a real interviewer. Record the conversation live or upload a recording afterwards. The AI will NOT answer questions \u2014 instead it listens, transcribes, and analyses your performance.",
    microcopy: "The AI won't participate in the conversation. It captures your real interview so you can review detailed feedback later.",
    primaryCTA: "I understood",
    image: require("@/assets/images/onboarding/record-interview.png"),
    icon: "briefcase-outline",
  },
];

const TutorialStepIndicator = ({ isActive, isCompleted }: { isActive: boolean; isCompleted: boolean }) => {
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

const TutorialScreen = ({
  stepIndex,
  isActive,
  shouldAnimate,
  handleNext,
  width,
}: {
  stepIndex: number;
  isActive: boolean;
  shouldAnimate: boolean;
  handleNext: () => void;
  width: number;
}) => {
  const step = tutorialSteps[stepIndex];
  const hasAnimated = useSharedValue(false);

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

  const buttonScale = useSharedValue(1);
  const floatValue = useSharedValue(0);

  useEffect(() => {
    if (isActive && shouldAnimate && !hasAnimated.value) {
      hasAnimated.value = true;

      // Image animation (immediate)
      imageOpacity.value = withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.ease),
      });
      imageTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });

      // Title animation (150ms delay)
      titleOpacity.value = withDelay(150, withTiming(1, { duration: 400 }));
      titleTranslateY.value = withDelay(150, withSpring(0, { damping: 15, stiffness: 100 }));

      // Body animation (250ms delay)
      bodyOpacity.value = withDelay(250, withTiming(1, { duration: 400 }));
      bodyTranslateY.value = withDelay(250, withSpring(0, { damping: 15, stiffness: 100 }));

      // Microcopy animation (350ms delay)
      microcopyOpacity.value = withDelay(350, withTiming(1, { duration: 400 }));
      microcopyTranslateY.value = withDelay(350, withSpring(0, { damping: 15, stiffness: 100 }));

      // CTA animation (450ms delay)
      ctaOpacity.value = withDelay(450, withTiming(1, { duration: 400 }));
      ctaTranslateY.value = withDelay(450, withSpring(0, { damping: 15, stiffness: 100 }));
    }
  }, [isActive, shouldAnimate]);

  useEffect(() => {
    floatValue.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );
  }, []);

  const imageContainerStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
    transform: [
      {
        translateY: imageTranslateY.value + interpolate(floatValue.value, [0, 1], [0, -8]),
      },
    ],
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

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleButtonPressIn = () => {
    buttonScale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
  };

  const handleButtonPressOut = () => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const isLastStep = stepIndex === tutorialSteps.length - 1;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FEFBED",
        paddingHorizontal: 24,
      }}
    >
      {step.comparisonTable ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Section for comparison table */}
          {step.image && (
            <View style={{ alignItems: "center", paddingTop: 16 }}>
              <Animated.View style={imageContainerStyle}>
                <Image
                  source={step.image}
                  style={{
                    width: width * 0.65,
                    height: width * 0.4,
                    maxHeight: 280,
                    borderRadius: 12,
                  }}
                  contentFit="contain"
                />
              </Animated.View>
            </View>
          )}

          {/* Title Section for comparison table */}
          <View style={{ paddingTop: 8, paddingBottom: 8, paddingHorizontal: 8 }}>
            <Animated.View style={[{ alignItems: "center", marginBottom: 12 }, titleStyle]}>
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
                  fontSize: 24,
                  fontWeight: "800",
                  color: "#1D252C",
                  textAlign: "center",
                  lineHeight: 32,
                  letterSpacing: -0.5,
                }}
              >
                {step.title}
              </Text>
            </Animated.View>

            <Animated.Text
              style={[
                {
                  fontSize: 14,
                  color: "#4B5563",
                  textAlign: "center",
                  lineHeight: 22,
                  marginBottom: 8,
                  letterSpacing: 0.1,
                },
                bodyStyle,
              ]}
            >
              {step.body}
            </Animated.Text>
          </View>

          {/* Comparison Table */}
          <Animated.View
            style={[
              {
                paddingHorizontal: 4,
              },
              microcopyStyle,
            ]}
          >
            {/* Table Header */}
            <View
              style={{
                flexDirection: "row",
                marginBottom: 4,
              }}
            >
              <View style={{ flex: 2 }} />
              <View
                style={{
                  flex: 3,
                  backgroundColor: "#FFF7DE",
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  paddingVertical: 10,
                  alignItems: "center",
                  marginHorizontal: 3,
                }}
              >
                <Ionicons name="school-outline" size={18} color="#E3AA1F" style={{ marginBottom: 4 }} />
                <Text style={{ fontSize: 13, fontWeight: "700", color: "#1D252C" }}>Mock</Text>
              </View>
              <View
                style={{
                  flex: 3,
                  backgroundColor: "#F0F0F0",
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  paddingVertical: 10,
                  alignItems: "center",
                  marginHorizontal: 3,
                }}
              >
                <Ionicons name="briefcase-outline" size={18} color="#6B7280" style={{ marginBottom: 4 }} />
                <Text style={{ fontSize: 13, fontWeight: "700", color: "#1D252C" }}>Real</Text>
              </View>
            </View>

            {/* Table Rows */}
            {step.comparisonTable.map((row, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  borderTopWidth: i > 0 ? 1 : 0,
                  borderTopColor: "#F3F4F6",
                }}
              >
                <View
                  style={{
                    flex: 2,
                    paddingVertical: 12,
                    paddingRight: 8,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: "600", color: "#6B7280", lineHeight: 16 }}>{row.label}</Text>
                </View>
                <View
                  style={{
                    flex: 3,
                    backgroundColor: "#FFFDF5",
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    justifyContent: "center",
                    marginHorizontal: 3,
                    borderBottomLeftRadius: i === step.comparisonTable!.length - 1 ? 12 : 0,
                    borderBottomRightRadius: i === step.comparisonTable!.length - 1 ? 12 : 0,
                  }}
                >
                  <Text style={{ fontSize: 12, color: "#1D252C", lineHeight: 16 }}>{row.mock}</Text>
                </View>
                <View
                  style={{
                    flex: 3,
                    backgroundColor: "#F9F9F9",
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    justifyContent: "center",
                    marginHorizontal: 3,
                    borderBottomLeftRadius: i === step.comparisonTable!.length - 1 ? 12 : 0,
                    borderBottomRightRadius: i === step.comparisonTable!.length - 1 ? 12 : 0,
                  }}
                >
                  <Text style={{ fontSize: 12, color: "#1D252C", lineHeight: 16 }}>{row.real}</Text>
                </View>
              </View>
            ))}
          </Animated.View>
        </ScrollView>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Section */}
          <View style={{ alignItems: "center", paddingTop: 16 }}>
            <Animated.View style={imageContainerStyle}>
              <Image
                source={step.image}
                style={{
                  width: width * 0.65,
                  height: width * 0.48,
                  maxHeight: 300,
                  borderRadius: 12,
                }}
                contentFit="contain"
              />
            </Animated.View>
          </View>

          {/* Text Content Section */}
          <View style={{ paddingHorizontal: 8, paddingTop: 8 }}>
            <Animated.View style={[{ alignItems: "center", marginBottom: 16 }, titleStyle]}>
              <View
                style={{
                  width: 40,
                  height: 4,
                  backgroundColor: "#FFC629",
                  borderRadius: 2,
                  marginBottom: 16,
                }}
              />
              {step.icon && (
                <View
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor: "#FFF7DE",
                    borderRadius: 24,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Ionicons name={step.icon} size={24} color="#E3AA1F" />
                </View>
              )}
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "800",
                  color: "#1D252C",
                  textAlign: "center",
                  lineHeight: 32,
                  letterSpacing: -0.5,
                }}
              >
                {step.title}
              </Text>
            </Animated.View>

            <Animated.Text
              style={[
                {
                  fontSize: 15,
                  color: "#4B5563",
                  textAlign: "center",
                  lineHeight: 24,
                  marginBottom: step.microcopy ? 16 : 20,
                  letterSpacing: 0.1,
                },
                bodyStyle,
              ]}
            >
              {step.body}
            </Animated.Text>

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
        </ScrollView>
      )}

      {/* CTA Section — always visible at bottom */}
      <Animated.View style={[{ paddingVertical: 16 }, ctaStyle]}>
        <AnimatedPressable
          onPress={handleNext}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
          accessibilityRole="button"
          accessibilityLabel={step.primaryCTA}
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
          {isLastStep ? (
            <Ionicons name="checkmark-circle" size={18} color="#1D252C" style={{ marginLeft: 8 }} />
          ) : (
            <Ionicons name="arrow-forward" size={18} color="#1D252C" style={{ marginLeft: 8 }} />
          )}
        </AnimatedPressable>
      </Animated.View>
    </View>
  );
};

type InterviewTutorialProps = {
  onComplete: () => void;
};

export const InterviewTutorial: React.FC<InterviewTutorialProps> = ({ onComplete }) => {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "step0", title: "Overview" },
    { key: "step1", title: "Mock Interview" },
    { key: "step2", title: "Real Interview" },
  ]);

  const handleIndexChange = (newIndex: number) => {
    setIndex(newIndex);
  };

  const handleNext = () => {
    if (index < routes.length - 1) {
      handleIndexChange(index + 1);
    } else {
      onComplete();
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
            <TutorialStepIndicator key={i} isActive={i === index} isCompleted={i < index} />
          ))}
        </View>
      </View>
    );
  };

  const renderScene = ({ route }: { route: { key: string } }) => {
    const stepIndex = routes.findIndex((r) => r.key === route.key);
    const shouldAnimate = stepIndex >= index;

    return (
      <TutorialScreen
        stepIndex={stepIndex}
        isActive={index === stepIndex}
        shouldAnimate={shouldAnimate}
        handleNext={handleNext}
        width={width}
      />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FEFBED" }}>
      <TabView
        lazy
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={handleIndexChange}
        initialLayout={{ width }}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};
