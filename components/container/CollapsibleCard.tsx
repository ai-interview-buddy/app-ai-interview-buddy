import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { LayoutChangeEvent, Text, TouchableOpacity, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface CollapsibleCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  children: React.ReactNode;
  initialExpanded?: boolean;
}

export const CollapsibleCard: React.FC<CollapsibleCardProps> = ({ icon, title, children, initialExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const animationProgress = useSharedValue(initialExpanded ? 1 : 0);

  useEffect(() => {
    animationProgress.value = withTiming(isExpanded ? 1 : 0, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
  }, [isExpanded]);

  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && Math.abs(height - measuredHeight) > 1) {
      setMeasuredHeight(height);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    // Add 16 to account for the top spacing of the content
    const targetHeight = measuredHeight > 0 ? measuredHeight + 16 : 0;
    return {
      height: targetHeight * animationProgress.value,
      opacity: measuredHeight === 0 ? 0 : 1,
      overflow: "hidden",
    };
  });

  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#FFF7DE",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <Ionicons name={icon} size={20} color="#FFC629" />
          </View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#1D252C",
            }}
          >
            {title}
          </Text>
        </View>
        <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={24} color="#6B7280" />
      </TouchableOpacity>

      <Animated.View style={animatedStyle}>
        <View
          onLayout={onLayout}
          collapsable={false}
          style={{
            // Absolute positioning ensures the content is never 'squashed' by the parent's animating height
            position: "absolute",
            top: 16,
            left: 0,
            right: 0,
          }}
        >
          {children}
        </View>
      </Animated.View>
    </View>
  );
};
