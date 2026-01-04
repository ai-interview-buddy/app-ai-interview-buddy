import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, LayoutChangeEvent, Text, TouchableOpacity, View } from "react-native";

interface CollapsibleCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  children: React.ReactNode;
  initialExpanded?: boolean;
}

export const CollapsibleCard: React.FC<CollapsibleCardProps> = ({ icon, title, children, initialExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [contentHeight, setContentHeight] = useState(0);
  const animatedValue = useRef(new Animated.Value(initialExpanded ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && height !== contentHeight) {
      setContentHeight(height);
    }
  };

  const heightValue = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
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

      <Animated.View
        style={{
          height: heightValue,
          overflow: "hidden",
        }}
      >
        <View
          onLayout={onLayout}
          style={{ marginTop: 16, position: contentHeight === 0 ? "absolute" : "relative", opacity: contentHeight === 0 ? 0 : 1 }}
        >
          {children}
        </View>
      </Animated.View>
    </View>
  );
};
