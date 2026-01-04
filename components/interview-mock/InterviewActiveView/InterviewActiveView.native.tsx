import RealTimeClient from "@/lib/openai";
import React, { useEffect, useRef, useState } from "react";
import InCallManager from "react-native-incall-manager";
import { mediaDevices, RTCPeerConnection } from "react-native-webrtc";
import { InterviewActiveAnimation } from "./InterviewActiveAnimation";

import { InterviewActiveViewProps } from "./types";

export const InterviewActiveView: React.FC<InterviewActiveViewProps> = ({ mockInterviewResponse, handleEndInterview }) => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [itemOrder, setItemOrder] = useState<string[]>([]);
  const [messagesMap, setMessagesMap] = useState<Record<string, any>>({});
  const [processedEventIds] = useState(new Set<string>());

  // Refs for WebRTC
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<any | null>(null);
  const msRef = useRef<any | null>(null);
  const sessionStartTimeRef = useRef<number>(0);

  useEffect(() => {
    if (mockInterviewResponse?.token && !isSessionActive) {
      startSession();
    }
    return () => {
      stopSession();
    };
  }, [mockInterviewResponse]);

  const startSession = async () => {
    if (!mockInterviewResponse?.token) return;

    try {
      InCallManager.start({ media: "audio" });
      InCallManager.setForceSpeakerphoneOn(true);

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      pcRef.current = pc;

      // @ts-ignore
      pc.ontrack = (e) => {
        console.log("RTC: Remote streams:", e.streams.length);
      };

      const ms = await mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      msRef.current = ms;

      ms.getTracks().forEach((track) => {
        pc.addTrack(track, ms);
      });

      const dc = pc.createDataChannel("oai-events") as any;
      dcRef.current = dc;

      dc.onopen = () => {
        dc.send(RealTimeClient.openEvent());
        dc.send(RealTimeClient.forceStartEvent());
      };

      dc.onmessage = (e: any) => {
        RealTimeClient.parseMessage(e, {
          setIsAISpeaking,
          setCurrentQuestion,
          setItemOrder,
          setMessagesMap,
          processedEventIds,
          sessionStartTime: sessionStartTimeRef.current,
        });
      };

      const offer = await pc.createOffer({});
      await pc.setLocalDescription(offer);

      const answer = await RealTimeClient.createConnection(offer.sdp, mockInterviewResponse.token);
      await pc.setRemoteDescription(answer);

      sessionStartTimeRef.current = Date.now();
      setIsSessionActive(true);
    } catch (err) {
      console.error("RTC: Failed to start session:", err);
    }
  };

  const stopSession = () => {
    InCallManager.stop();

    if (dcRef.current) {
      dcRef.current.close();
      dcRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (msRef.current) {
      msRef.current.getTracks().forEach((track: any) => track.stop());
      msRef.current = null;
    }
    setIsSessionActive(false);
  };

  return (
    <InterviewActiveAnimation
      currentQuestion={currentQuestion}
      isAISpeaking={isAISpeaking}
      handleEndInterview={() => {
        stopSession();
        const finalTranscript = itemOrder.map((id) => messagesMap[id]).filter((msg) => msg && msg.sentences.length > 0);
        handleEndInterview(finalTranscript);
      }}
    />
  );
};

export default InterviewActiveView;
