"use client";

import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { VStack } from "@/components/ui/vstack";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useState } from "react";
import { Dimensions, KeyboardAvoidingView, Platform, ScrollView, StatusBar, Text, useColorScheme, View } from "react-native";

const { height } = Dimensions.get("window");

export default function PremiumLogin() {
  const [isGooglePressed, setIsGooglePressed] = useState(false);
  const [isLinkedInPressed, setIsLinkedInPressed] = useState(false);
  const colorScheme = useColorScheme();

  const handleGoogleLogin = () => console.log("Google login pressed");
  const handleLinkedInLogin = () => console.log("LinkedIn login pressed");

  const barStyle = colorScheme === "dark" ? "light-content" : "dark-content";

  return (
    <View className="flex-1 relative bg-gray-900 dark:bg-white">
      <StatusBar barStyle={barStyle} />

      {/* Gradient Background */}
      <LinearGradient
        colors={colorScheme === "dark" ? ["#1D252C", "#2A3440", "#1D252C"] : ["#FEFBED", "#FFF7DE", "#FEFBED"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />

      {/* Orbs */}
      <View className="absolute rounded-full opacity-20 bg-yellow-400 w-52 h-52 -top-12 -right-12" />
      <View className="absolute rounded-full opacity-20 bg-yellow-500 w-36 h-36 bottom-24 -left-8" />
      <View className="absolute rounded-full opacity-20 bg-yellow-100 w-24 h-24" style={{ top: height * 0.3, right: 50 }} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 pt-20 pb-10" showsVerticalScrollIndicator={false}>
          {/* Logo */}
          <View className="items-center mb-12">
            <LinearGradient colors={["#FFC629", "#E3AA1F"]} className="w-24 h-24 rounded-full justify-center items-center shadow-lg mb-5">
              <Ionicons name="diamond" size={40} color={colorScheme === "dark" ? "#FEFBED" : "#1D252C"} />
            </LinearGradient>
            <Text className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">AI Interview Buddy</Text>
            {/* Tagline: brighter on dark, richer on light */}
            <Text className="text-base font-medium dark:text-yellow-300 text-yellow-600 text-center">
              Master your next interview with AI
            </Text>
          </View>

          {/* Card */}
  {/* outer wrapper: shadow + rounded corners */}
  <Box className="rounded-3xl shadow-2xl mb-8 bg-gray-50 dark:bg-gray-800 android:elevation-10">
    {/* inner wrapper: same radius + overflow-hidden to clip children */}
    <Box className="rounded-3xl overflow-hidden">
            <BlurView intensity={15} tint={colorScheme === "dark" ? "dark" : "light"}>
              <View className="p-8 bg-gray-50 dark:bg-gray-800">
                {/* Header */}
                <View className="mb-10 items-center">
                  <Text className="text-2xl font-extrabold dark:text-white text-gray-900 mb-3">Welcome</Text>
                  {/* Subtitle: dark-on-light, light-on-dark */}
                  <Text className="text-sm font-medium text-gray-800 dark:text-gray-200 text-center leading-6 opacity-80">
                    Choose your preferred way to continue
                  </Text>
                </View>

                {/* Social Buttons */}
                <VStack className="pb-4" space="md">
                  <Button size="xl" action="primary" className="flex-row items-center justify-center">
                    <ButtonText className="ml-2">
                      <Box className="flex flex-row place-items-center gap-1">
                        <Ionicons name="logo-google" size={24} color="#ea4335" />
                        <Text className="flex-1 text-base font-bold dark:text-white text-gray-900 tracking-wide">Continue with Google</Text>
                        <Ionicons name="arrow-forward" size={20} color={colorScheme === "dark" ? "#FFF" : "#1D252C"} />
                      </Box>
                    </ButtonText>
                  </Button>

                  <Button size="xl" action="primary" className="flex-row items-center justify-center">
                    <ButtonText className="ml-2">
                      <Box className="flex flex-row place-items-center gap-1">
                        <Ionicons name="logo-linkedin" size={24} color="#0077b5" />
                        <Text className="flex-1 text-base font-bold dark:text-white text-gray-900 tracking-wide">
                          Continue with LinkedIn
                        </Text>
                        <Ionicons name="arrow-forward" size={20} color={colorScheme === "dark" ? "#FFF" : "#1D252C"} />
                      </Box>
                    </ButtonText>
                  </Button>
                </VStack>

                {/* Features */}
                <View className="p-5 bg-gray-100 dark:bg-gray-700 rounded-lg border border-yellow-400">
                  <Text className="text-base font-bold dark:text-white text-gray-900 mb-4 text-center">What you'll get:</Text>
                  <View className="space-y-3">
                    {["AI-powered interview practice", "Personalized feedback & tips", "Track your progress"].map((item, i) => (
                      <View key={i} className="flex-row items-center">
                        <View className="w-6 h-6 rounded-full bg-yellow-400 items-center justify-center mr-3 mb-1">
                          <Ionicons name="checkmark" size={16} color={colorScheme === "dark" ? "#000" : "#000"} />
                        </View>
                        <Text className="text-sm font-semibold dark:text-white text-gray-900 opacity-80">{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </BlurView>
          </Box>
          </Box>

          {/* Footer */}
          <View className="px-4">
            <Text className="text-xs font-medium text-yellow-600 dark:text-yellow-300 opacity-80 text-center leading-5">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
