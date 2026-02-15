import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import type React from "react";
import { useEffect, useState } from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
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

type TutorialStep = {
  title: string;
  body: string;
  microcopy?: string;
  primaryCTA: string;
  image: any;
  icon?: keyof typeof Ionicons.glyphMap;
};

const tutorialSteps: TutorialStep[] = [
  {
    title: "Two types of interview",
    body: "We offer two distinct interview modes, each designed for a different stage of your preparation. Understanding the difference will help you get the most out of the app.",
    microcopy:
      "Choose Mock to practice with AI, or Real to get feedback on an actual interview you've had.",
    primaryCTA: "Tell me more",
    image: require("@/assets/images/onboarding/welcome.png"),
  },
  {
    title: "Mock Interview",
    body: "It's you and the AI, face to face. The AI acts as your interviewer, asking you real-world questions based on the role you're targeting. You answer out loud, and get instant structured feedback.",
    microcopy:
      "Think of it as a practice session: no real interviewer is involved. It's your safe space to rehearse.",
    primaryCTA: "Got it, next",
    image: require("@/assets/images/onboarding/mock-interview.png"),
    icon: "school-outline",
  },
  {
    title: "Real Interview",
    body: "This is for your actual interviews with a real interviewer. Record the conversation live or upload a recording afterwards. The AI will NOT answer questions \u2014 instead it listens, transcribes, and analyses your performance.",
    microcopy:
      "The AI won't participate in the conversation. It captures your real interview so you can review detailed feedback later.",
    primaryCTA: "I understood",
    image: require("@/assets/images/onboarding/record-interview.png"),
    icon: "briefcase-outline",
  },
];

const TutorialStepIndicator = ({
  isActive,
  isCompleted,
}: {
  isActive: boolean;
  isCompleted: boolean;
}) => {
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
      titleTranslateY.value = withDelay(
        150,
        withSpring(0, { damping: 15, stiffness: 100 })
      );

      // Body animation (250ms delay)
      bodyOpacity.value = withDelay(250, withTiming(1, { duration: 400 }));
      bodyTranslateY.value = withDelay(
        250,
        withSpring(0, { damping: 15, stiffness: 100 })
      );

      // Microcopy animation (350ms delay)
      microcopyOpacity.value = withDelay(
        350,
        withTiming(1, { duration: 400 })
      );
      microcopyTranslateY.value = withDelay(
        350,
        withSpring(0, { damping: 15, stiffness: 100 })
      );

      // CTA animation (450ms delay)
      ctaOpacity.value = withDelay(450, withTiming(1, { duration: 400 }));
      ctaTranslateY.value = withDelay(
        450,
        withSpring(0, { damping: 15, stiffness: 100 })
      );
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
        translateY:
          imageTranslateY.value +
          interpolate(floatValue.value, [0, 1], [0, -8]),
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
      {/* Image Section */}
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
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.12,
              shadowRadius: 24,
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
        <Animated.View
          style={[{ alignItems: "center", marginBottom: 20 }, titleStyle]}
        >
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
              <Ionicons
                name="checkmark-circle"
                size={18}
                color="#1D252C"
                style={{ marginLeft: 8 }}
              />
            ) : (
              <Ionicons
                name="arrow-forward"
                size={18}
                color="#1D252C"
                style={{ marginLeft: 8 }}
              />
            )}
          </AnimatedPressable>
        </Animated.View>
      </View>
    </View>
  );
};

type InterviewTutorialProps = {
  onComplete: () => void;
};

export const InterviewTutorial: React.FC<InterviewTutorialProps> = ({
  onComplete,
}) => {
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
            <TutorialStepIndicator
              key={i}
              isActive={i === index}
              isCompleted={i < index}
            />
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
