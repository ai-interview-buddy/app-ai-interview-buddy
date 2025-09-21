import { useTimelineItemInterviewUrl } from "@/lib/api/timelineItem.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { TimelineItem } from "@/supabase/functions/api/types/TimelineItem";
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ButtonDefault } from "../button/ButtonDefault";

interface Props {
  timelineItem: TimelineItem;
}

function formatSeconds(sec?: number | null) {
  if (sec == null || !isFinite(sec)) return "00:00";
  const total = Math.max(0, Math.floor(sec));
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function AudioPlayer({ timelineItem }: Props) {
  const { user } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);
  const progressWidthRef = useRef(1);

  const { data: url, isLoading } = useTimelineItemInterviewUrl(user?.accessToken!, timelineItem.id as string);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: true,
          interruptionMode: "doNotMix",
          interruptionModeAndroid: "duckOthers",
        });

        if (!url?.signedUrl) return;
        if (!mounted) return;
        player.replace(url.signedUrl);
        setIsReady(true);
      } catch (e: any) {
        console.log(e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [timelineItem.id, url?.signedUrl]);

  const togglePlay = useCallback(() => {
    if (status.playing) player.pause();
    else {
      const nearEnd = status.duration && status.currentTime >= status.duration - 0.25;
      if (nearEnd) player.seekTo(0);
      player.play();
    }
  }, [status.playing, status.currentTime, status.duration, player]);

  // const onProgressPress = useCallback(
  //   (locationX: number) => {
  //     if (!status.duration) return;
  //     const ratio = Math.max(0, Math.min(1, locationX / (progressWidthRef.current || 1)));
  //     const newTime = ratio * status.duration;
  //     player.seekTo(newTime);
  //   },
  //   [status.duration, player]
  // );

  if (!isReady || isLoading) {
    return null;
  }

  return (
    <View style={{ width: "100%", gap: 12 }}>
      <ButtonDefault
        label={status.playing ? "Pause" : "Play"}
        onPress={togglePlay}
        icon={status.playing ? "pause-circle-outline" : "play-circle-outline"}
      />

      {/* Progress bar */}
      <View
        onLayout={(e) => (progressWidthRef.current = e.nativeEvent.layout.width)}
        style={{ width: "100%", height: 10, backgroundColor: "#e5e7eb", borderRadius: 9999, overflow: "hidden" }}
      >
        <Pressable style={{ width: "100%", height: "100%" }} onPress={(e) => console.log(e)}>
          <View
            style={{
              width: `${Math.round((status.duration ? status.currentTime / status.duration : 0) * 100)}%`,
              height: "100%",
              backgroundColor: "#16a34a",
            }}
          />
        </Pressable>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text>{formatSeconds(status.currentTime)}</Text>
        <Text>{formatSeconds(status.duration)}</Text>
      </View>
    </View>
  );
}
