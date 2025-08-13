import CareerProfileForm from "@/components/career-profile/create/CareerProfileForm";
import { MainContainer } from "@/components/container/MainContainer";
import { CenteredTextHeading } from "@/components/headers/CenteredTextHeading";
import AlertPolyfill from "@/components/ui/alert-web/AlertPolyfill";
import { useAuthStore } from "@/lib/supabase/authStore";
import { CareerProfile } from "@/supabase/functions/api/types/CareerProfile";
import { Stack, router } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";

const CreateCareerProfile = () => {
  const { completeOnboarding } = useAuthStore();

  const handleSave = async (saved: CareerProfile) => {
    try {
      completeOnboarding();
      router.push(`/(tabs)/career-profile/${saved.id}`);
    } catch (error) {
      console.log(error);
      AlertPolyfill("Error", "Failed to upload CV. Please try again.");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MainContainer>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: 20, paddingTop: 10, marginBottom: 0 }}>
            <CenteredTextHeading
              title="Let's get started!"
              subtitle="Upload your CV. This will help us analyse your experience and give you tailored recommendations for the positions you apply."
            />
          </View>
          <View style={{ flex: 1, paddingHorizontal: 20, justifyContent: "center" }}>
            <CareerProfileForm onConfirm={handleSave} />
          </View>
        </ScrollView>
      </MainContainer>
    </>
  );
};

export default CreateCareerProfile;
