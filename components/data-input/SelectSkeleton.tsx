// SelectSkeleton.tsx
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { AccessibilityRole, Animated, StyleSheet, useColorScheme, View } from "react-native";

export function SelectSkeleton() {
  const scheme = useColorScheme();
  const shimmerX = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmerX, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [shimmerX]);

  const bg = scheme === "dark" ? "#2a2a2a" : "#e9e9ee";
  const highlightStart = "transparent";
  const highlightMid = scheme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.7)";
  const highlightEnd = "transparent";

  return (
    <View accessibilityRole={"progressbar" as AccessibilityRole} accessibilityLabel="Loading options" style={styles.container}>
      <View style={[styles.bar, { width: 90, height: 12, backgroundColor: bg, marginBottom: 8 }]} />

      <View style={[styles.selectBox, { backgroundColor: bg }]}>
        <View style={[styles.bar, { width: "45%", height: 14, backgroundColor: bg }]} />
        <View style={[styles.dot, { backgroundColor: bg }]} />
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              transform: [
                {
                  translateX: shimmerX.interpolate({
                    inputRange: [-1, 1],
                    outputRange: [-250, 250],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={[highlightStart, highlightMid, highlightEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  bar: { borderRadius: 6 },
  selectBox: {
    marginBottom: 16,
    height: 48,
    borderRadius: 12,
    overflow: "hidden",
    paddingHorizontal: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dot: { width: 8, height: 8, borderRadius: 4, opacity: 0.7 },
});
