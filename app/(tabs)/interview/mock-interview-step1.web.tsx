import { MainContainer } from "@/components/container/MainContainer";
import { Button } from "@/components/ui/button";
import { useCreateMockInterview } from "@/lib/api/mockInterview.query";
import RealTimeClient from "@/lib/openai";
import { useAuthStore } from "@/lib/supabase/authStore";
import { MockInterviewResponse } from "@/supabase/functions/api/types/MockInterview";
import { useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";

const MockInterviewStep1: React.FC = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [mockInterview, setMockInterview] = useState<MockInterviewResponse | null>(null);
  const { jobPositionId } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const { mutateAsync } = useCreateMockInterview(queryClient, user?.accessToken);
  const [isSessionActive, setIsSessionActive] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const body = {
    careerProfileId: "1b2188f1-b0fd-4dbb-9543-18712a8bd281",
    positionId: "23ddb91e-e8f8-416f-8464-03be8ce7fe1c",
  };

  useEffect(() => {
    (async () => {
      const mockInterviewResponse = await mutateAsync(body);
      setMockInterview(mockInterviewResponse);
    })();
  }, []);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopSession();
    };
  }, []);

  const startSession = async () => {
    if (!mockInterview?.token) return;

    try {
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      audioRef.current = audioEl;

      pc.ontrack = (e) => {
        if (audioRef.current) {
          audioRef.current.srcObject = e.streams[0];
        }
      };

      const ms = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      pc.addTrack(ms.getTracks()[0]);

      const dc = pc.createDataChannel("oai-events");
      dc.onopen = () => {
        dc.send(RealTimeClient.openEvent());
        dc.send(RealTimeClient.forceStartEvent());
      };

      dc.onmessage = (e) => {
        RealTimeClient.parseMessage(e);
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const answer = await RealTimeClient.createConnection(offer.sdp, mockInterview.token);
      await pc.setRemoteDescription(answer);

      console.log("RTC: Remote description set, waiting for connection...");

      setIsSessionActive(true);
    } catch (err) {
      console.error("Failed to start session:", err);
    }
  };

  const stopSession = () => {
    if (dcRef.current) {
      dcRef.current.close();
      dcRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.remove();
      audioRef.current = null;
    }
    setIsSessionActive(false);
  };

  const handleBack = () => (jobPositionId ? router.push(`/job-position/${jobPositionId}`) : router.push("/interview"));
  const handleCancel = () => (jobPositionId ? router.push(`/job-position`) : router.push("/interview"));

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MainContainer>
        <View style={{ gap: 20, padding: 20 }}>
          <Button onPress={startSession} disabled={!mockInterview || isSessionActive}>
            Start Interview
          </Button>
          <Button onPress={stopSession} disabled={!isSessionActive}>
            Stop Interview
          </Button>
          {isSessionActive && (
            <View style={{ marginTop: 10 }}>
              <Button onPress={() => console.log("Listening...")} variant="outline">
                Listening...
              </Button>
            </View>
          )}
        </View>
      </MainContainer>
    </>
  );
};

export default MockInterviewStep1;
