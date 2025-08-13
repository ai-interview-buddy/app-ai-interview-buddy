import { MainContainer } from "@/components/container/MainContainer";
import { TitleBackHeader } from "@/components/headers/TitleBackHeader";
import { QuestionDetailContainer } from "@/components/interview/details/QuestionDetailContainer";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { default as React } from "react";

export default function QuestionView() {
  const router = useRouter();
  const { questionId } = useLocalSearchParams();

  const handleBack = () => router.back();
  const handleCancel = () => router.push("/job-position");

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MainContainer>
        <TitleBackHeader pageTitle="Interview Question" handleBack={handleBack} handleCancel={handleCancel} />

        <QuestionDetailContainer questionId={questionId as string} />
      </MainContainer>
    </>
  );
}
