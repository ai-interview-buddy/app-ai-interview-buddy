import { MainContainer } from "@/components/container/MainContainer";
import { Button } from "@/components/ui/button";
import { useCreateMockInterview } from "@/lib/api/mockInterview.query";
import RealTimeClient from "@/lib/openai";
import { useAuthStore } from "@/lib/supabase/authStore";
import { MockInterviewResponse } from "@/supabase/functions/api/types/MockInterview";
import { useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { mediaDevices, RTCPeerConnection } from "react-native-webrtc";

const MockInterviewStep1: React.FC = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [mockInterview, setMockInterview] = useState<MockInterviewResponse | null>(null);
  const { jobPositionId } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const { mutateAsync } = useCreateMockInterview(queryClient, user?.accessToken);
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Refs for WebRTC
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<any | null>(null);

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
    return () => {
      stopSession();
    };
  }, []);

  const startSession = async () => {
    if (!mockInterview?.token) return;

    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      pcRef.current = pc;

      // @ts-ignore
      pc.ontrack = (e) => {
        console.log("RTC: Remote streams:", e.streams.length);
      };

      // @ts-ignore
      pc.onconnectionstatechange = () => {
        console.log("RTC: Connection state:", pc.connectionState);
      };

      // @ts-ignore
      pc.oniceconnectionstatechange = () => {
        console.log("RTC: ICE connection state:", pc.iceConnectionState);
      };

      const ms = await mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      ms.getTracks().forEach((track) => {
        pc.addTrack(track, ms);
      });

      const dc = pc.createDataChannel("oai-events") as any;
      dcRef.current = dc;

      dc.onopen = () => {
        dc.send(RealTimeClient.openEvent());
        dc.send(RealTimeClient.forceStartEvent());
      };

      dc.onerror = (e: any) => {
        console.error("RTC: Data channel error:", e);
      };

      dc.onclose = () => {
        console.log("RTC: Data channel closed");
      };

      dc.onmessage = (e: any) => {
        RealTimeClient.parseMessage(e);
      };

      const offer = await pc.createOffer({});
      await pc.setLocalDescription(offer);

      const answer = await RealTimeClient.createConnection(offer.sdp, mockInterview.token);
      await pc.setRemoteDescription(answer);

      console.log("RTC: Remote description set, waiting for connection...");

      setIsSessionActive(true);
    } catch (err) {
      console.error("RTC: Failed to start session:", err);
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
            <Text>Start Interview (iOS)</Text>
          </Button>
          <Button onPress={stopSession} disabled={!isSessionActive}>
            <Text>Stop Interview</Text>
          </Button>
          {isSessionActive && (
            <View style={{ marginTop: 10 }}>
              <Button onPress={() => console.log("Listening...")} variant="outline">
                <Text> Listening...</Text>
              </Button>
            </View>
          )}
        </View>
      </MainContainer>
    </>
  );
};

export default MockInterviewStep1;
