import { MainContainer } from "@/components/container/MainContainer";
import { CenteredTextHeading } from "@/components/headers/CenteredTextHeading";
import { TitleBackHeader } from "@/components/headers/TitleBackHeader";
import { InterviewTutorial } from "@/components/interview/InterviewTutorial";
import { useUiStore } from "@/lib/storage/uiStore";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";

const CreateStep1: React.FC = () => {
  const router = useRouter();
  const { positionId } = useLocalSearchParams();
  const hasDoneInterviewTutorial = useUiStore((s) => s.hasDoneInterviewTutorial);
  const markAsOpened = useUiStore((s) => s.markAsOpened);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const unsub = useUiStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    // In case hydration already finished before mount
    if (useUiStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }

    return unsub;
  }, []);

  const handleBack = () => (positionId ? router.push(`/job-position/${positionId}`) : router.push("/interview"));
  const handleCancel = () => (positionId ? router.push(`/job-position`) : router.push("/interview"));

  const handleTutorialComplete = () => {
    markAsOpened("hasDoneInterviewTutorial");
  };

  if (!hasHydrated) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <MainContainer>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#FFC629" />
          </View>
        </MainContainer>
      </>
    );
  }

  if (!hasDoneInterviewTutorial) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <MainContainer>
          <InterviewTutorial onComplete={handleTutorialComplete} />
        </MainContainer>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <MainContainer>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <TitleBackHeader pageTitle="New interview" handleBack={handleBack} handleCancel={handleCancel} />

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 40,
            }}
            showsVerticalScrollIndicator={false}
          >
            <CenteredTextHeading
              title="What type of interview do you want?"
              subtitle="Choose between a mock interview or a real interview"
            />

            <View style={{ gap: 16 }}>
              <Link
                href={{
                  pathname: "/interview/mock-interview-step1",
                  params: { positionId },
                }}
                push
                asChild
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    borderRadius: 20,
                    padding: 24,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 8,
                    elevation: 2,
                    borderWidth: 2,
                    borderColor: "transparent",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        backgroundColor: "#FFF7DE",
                        borderRadius: 24,
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 16,
                      }}
                    >
                      <Ionicons name="school-outline" size={24} color="#E3AA1F" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 18, fontWeight: "700", color: "#1D252C", marginBottom: 4 }}>Mock Interview</Text>
                      <Text style={{ fontSize: 14, color: "#6B7280", lineHeight: 20 }}>
                        Practice with simulated questions and get structured AI feedback
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>
              </Link>
              <Link
                href={{
                  pathname: "/interview/create-interview-analyse-step1",
                  params: { positionId },
                }}
                push
                asChild
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    borderRadius: 20,
                    padding: 24,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 8,
                    elevation: 2,
                    borderWidth: 2,
                    borderColor: "transparent",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        backgroundColor: "#FFF7DE",
                        borderRadius: 24,
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 16,
                      }}
                    >
                      <Ionicons name="briefcase-outline" size={24} color="#E3AA1F" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 18, fontWeight: "700", color: "#1D252C", marginBottom: 4 }}>Real Interview</Text>
                      <Text style={{ fontSize: 14, color: "#6B7280", lineHeight: 20 }}>
                        Analyse a real interview capturing it live or by uploading a recording
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>
              </Link>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </MainContainer>
    </>
  );
};

export default CreateStep1;
