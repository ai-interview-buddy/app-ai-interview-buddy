import { MainContainer } from "@/components/container/MainContainer";
import { CenteredTextHeading } from "@/components/headers/CenteredTextHeading";
import { TitleBackHeader } from "@/components/headers/TitleBackHeader";
import { StepIndicator } from "@/components/misc/StepIndicator";
import { useCreateMockInterview } from "@/lib/api/mockInterview.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { MockInterviewResponse } from "@/supabase/functions/api/types/MockInterview";
import { Ionicons } from "@expo/vector-icons";
import { OpenAIRealtimeWebRTC, RealtimeAgent, RealtimeSession } from "@openai/agents/realtime";
import { useQueryClient } from "@tanstack/react-query";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";

const MockInterviewStep1: React.FC = () => {
  const router = useRouter();

  const { user } = useAuthStore();
  const [mockInterview, setMockInterview] = useState<MockInterviewResponse | null>(null);
  const [session, setSession] = useState<RealtimeSession | null>(null);

  const { jobPositionId } = useLocalSearchParams();

  const queryClient = useQueryClient();

  const { mutateAsync } = useCreateMockInterview(queryClient, user?.accessToken);

  const body = {
    careerProfileId: "1b2188f1-b0fd-4dbb-9543-18712a8bd281",
    positionId: "23ddb91e-e8f8-416f-8464-03be8ce7fe1c",
  };

  useEffect(() => {
    (async () => {
      const mockInterviewResponse: MockInterviewResponse = await mutateAsync(body);
      setMockInterview(mockInterviewResponse);

      const agent = new RealtimeAgent({
        name: "Assistant",
        instructions: mockInterviewResponse.instructions,
      });

      const webRTC = new OpenAIRealtimeWebRTC({ useInsecureApiKey: true });

      const session = new RealtimeSession(agent, {
        model: "gpt-realtime-mini",
        transport: webRTC,
      });

      await session.connect({ apiKey: mockInterviewResponse.token });
      setSession(session);
    })();
  }, []);
  console.log(mockInterview);
  console.log(session);

  const handleBack = () => (jobPositionId ? router.push(`/job-position/${jobPositionId}`) : router.push("/interview"));
  const handleCancel = () => (jobPositionId ? router.push(`/job-position`) : router.push("/interview"));

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <MainContainer>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <TitleBackHeader pageTitle="Interview feedback" handleBack={handleBack} handleCancel={handleCancel} />

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 40,
            }}
            showsVerticalScrollIndicator={false}
          >
            <StepIndicator currentStep={1} totalSteps={2} />
            <CenteredTextHeading title="Mockkk" subtitle="Choose to record in-app or import an existing audio file" />

            <View style={{ gap: 16 }}>
              <Link
                href={{
                  pathname: "/interview/create-interview-analyse-step2-record",
                  params: { jobPositionId: jobPositionId },
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
                      <Ionicons name="mic-outline" size={24} color="#E3AA1F" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 18, fontWeight: "700", color: "#1D252C", marginBottom: 4 }}>Record Interview</Text>
                      <Text style={{ fontSize: 14, color: "#6B7280", lineHeight: 20 }}>
                        Use your device's microphone to capture live audio
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>
              </Link>
              <Link
                href={{
                  pathname: "/interview/create-interview-analyse-step2-upload",
                  params: { jobPositionId: jobPositionId },
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
                      <Ionicons name="cloud-upload-outline" size={24} color="#E3AA1F" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 18, fontWeight: "700", color: "#1D252C", marginBottom: 4 }}>Upload Recording</Text>
                      <Text style={{ fontSize: 14, color: "#6B7280", lineHeight: 20 }}>Select an existing audio file from your device</Text>
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

export default MockInterviewStep1;
