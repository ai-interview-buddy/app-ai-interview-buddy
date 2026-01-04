import RealTimeClient from "@/lib/openai";
import React, { useEffect, useRef, useState } from "react";
import { InterviewActiveAnimation } from "./InterviewActiveAnimation";

import { InterviewActiveViewProps } from "./types";

export const InterviewActiveView: React.FC<InterviewActiveViewProps> = ({ mockInterviewResponse, handleEndInterview }) => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [itemOrder, setItemOrder] = useState<string[]>([]);
  const [messagesMap, setMessagesMap] = useState<Record<string, any>>({});
  const [processedEventIds] = useState(new Set<string>());

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const msRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
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
      msRef.current = ms;
      pc.addTrack(ms.getTracks()[0]);

      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;

      dc.onopen = () => {
        dc.send(RealTimeClient.openEvent());
        dc.send(RealTimeClient.forceStartEvent());
      };

      dc.onmessage = (e) => {
        RealTimeClient.parseMessage(e, {
          setIsAISpeaking,
          setCurrentQuestion,
          setItemOrder,
          setMessagesMap,
          processedEventIds,
          sessionStartTime: sessionStartTimeRef.current,
        });
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const answer = await RealTimeClient.createConnection(offer.sdp, mockInterviewResponse.token);
      await pc.setRemoteDescription(answer);

      sessionStartTimeRef.current = Date.now();
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
    if (msRef.current) {
      msRef.current.getTracks().forEach((track) => track.stop());
      msRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.srcObject = null;
      audioRef.current.remove();
      audioRef.current = null;
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
