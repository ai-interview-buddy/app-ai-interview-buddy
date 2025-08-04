import CareerProfileForm from "@/components/career-profile/create/CareerProfileForm";
import { MainContainer } from "@/components/container/MainContainer";
import { TitleBackHeader } from "@/components/headers/TitleBackHeader";
import AlertPolyfill from "@/components/ui/alert-web/AlertPolyfill";
import { useCreateCareerProfile } from "@/lib/api/careerProfile.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { supabase } from "@/lib/supabase/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { DocumentPickerAsset } from "expo-document-picker";
import { Stack, router } from "expo-router";
import React from "react";

const CreateCareerProfile = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { mutateAsync } = useCreateCareerProfile(queryClient, user?.accessToken);

  if (!user) return null;

  const handleSave = async (file: DocumentPickerAsset) => {
    try {
      const arraybuffer = await fetch(file.uri).then((res) => res.arrayBuffer());
      const fileExt = (file.name || file.uri)?.split(".").pop()?.toLowerCase() ?? "pdf";
      const curriculumPath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage.from("curriculums").upload(curriculumPath, arraybuffer, {
        contentType: file.mimeType,
      });
      if (error) throw error;

      const saved = await mutateAsync({ curriculumPath });
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

        <CareerProfileForm
          title="Please inform your CV"
          subtitle="Upload your resume to get a detailed analysis and personalized recommendations"
          allowedTypes={["application/pdf"]}
          onConfirm={handleSave}
        />
      </MainContainer>
    </>
  );
};

export default CreateCareerProfile;
