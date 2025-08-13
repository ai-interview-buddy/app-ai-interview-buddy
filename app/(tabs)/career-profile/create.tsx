import CareerProfileForm from "@/components/career-profile/create/CareerProfileForm";
import { MainContainer } from "@/components/container/MainContainer";
import { TitleBackHeader } from "@/components/headers/TitleBackHeader";
import AlertPolyfill from "@/components/ui/alert-web/AlertPolyfill";
import { CareerProfile } from "@/supabase/functions/api/types/CareerProfile";
import { Stack, router } from "expo-router";
import React from "react";
import { View } from "react-native";

const CreateCareerProfile = () => {
  const handleSave = async (saved: CareerProfile) => {
    try {
      router.push(`/(tabs)/career-profile/${saved.id}`);
    } catch (error) {
      console.log(error);
      AlertPolyfill("Error", "Failed to upload CV. Please try again.");
    }
  };

  const handleBack = () => router.push(`/career-profile`);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MainContainer>
        <TitleBackHeader pageTitle="New Career Profile" handleBack={handleBack} handleCancel={handleBack} />
        <View style={{ flex: 1, paddingHorizontal: 20, justifyContent: "center" }}>
          <CareerProfileForm onConfirm={handleSave} />
        </View>
      </MainContainer>
    </>
  );
};

export default CreateCareerProfile;
