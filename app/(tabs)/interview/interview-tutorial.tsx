import { MainContainer } from "@/components/container/MainContainer";
import { InterviewTutorial } from "@/components/interview/InterviewTutorial";
import { useUiStore } from "@/lib/storage/uiStore";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

const InterviewTutorialScreen: React.FC = () => {
  const router = useRouter();
  const { positionId } = useLocalSearchParams();
  const markAsOpened = useUiStore((s) => s.markAsOpened);

  const handleTutorialComplete = () => {
    markAsOpened("hasDoneInterviewTutorial");
    router.replace({
      pathname: "/interview/create-interview",
      params: { positionId },
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MainContainer>
        <InterviewTutorial onComplete={handleTutorialComplete} />
      </MainContainer>
    </>
  );
};

export default InterviewTutorialScreen;
