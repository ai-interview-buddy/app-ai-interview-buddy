import GoogleAuth from "@/components/auth/GoogleAuth";
import { ItemListBox } from "@/components/boxes/ItemListBox";
import { RoundedShadowBox } from "@/components/boxes/RoundedShadowBox";
import { FancyContainer } from "@/components/container/FancyContainer";
import { LogoRadialBg } from "@/components/logo/LogoRadialBg";
import { Box } from "@/components/ui/box";
import { ExternalLink } from "@/components/ui/external-link";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

export default function PremiumLogin() {
  return (
    <FancyContainer>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 pt-20 pb-10" showsVerticalScrollIndicator={false}>
          <Box className="items-center mb-12">
            <LogoRadialBg />
            <Text className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2" numberOfLines={1} adjustsFontSizeToFit={false}>
              AI Interview Buddy
            </Text>
            <Text className="text-base font-medium dark:text-yellow-300 text-yellow-600 text-center">
              Master your next interview with AI
            </Text>
          </Box>
          <RoundedShadowBox>
            <View className="mb-10 items-center">
              <Text className="text-2xl font-extrabold dark:text-white text-gray-900 mb-3">Welcome</Text>
              <Text className="text-sm font-medium text-gray-800 dark:text-gray-200 text-center leading-6 opacity-80">
                Choose your preferred way to continue
              </Text>
            </View>

            <VStack className="pb-4" space="md">
              <GoogleAuth />
            </VStack>

            <ItemListBox
              title="What you'll get:"
              items={["AI-powered interview practice", "Personalized feedback & tips", "Track your progress"]}
            />
          </RoundedShadowBox>

          <View className="px-4 items-center">
            <Text className="text-xs font-medium text-yellow-600 dark:text-yellow-300 opacity-80 text-center leading-5">
              By continuing, you agree to our{" "}
              <ExternalLink href="https://aiinterviewbuddy.com/terms-of-service" className="text-yellow-600 dark:text-yellow-300">
                Terms of Service
              </ExternalLink>{" "}
              and{" "}
              <ExternalLink href="https://aiinterviewbuddy.com/privacy-policy" className="text-yellow-600 dark:text-yellow-300">
                Privacy Policy
              </ExternalLink>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </FancyContainer>
  );
}
