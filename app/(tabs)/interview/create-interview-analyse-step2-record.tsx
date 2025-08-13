import { MainContainer } from "@/components/container/MainContainer";
import { UploadProgressDialog } from "@/components/dialogs/UploadProgressDialog";
import { TitleBackHeader } from "@/components/headers/TitleBackHeader";
import AlertPolyfill from "@/components/ui/alert-web/AlertPolyfill";
import { useCreateTimelineInterviewAnalyse } from "@/lib/api/timelineItem.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { formatTime } from "@/lib/utils/format.utils";
import {
  foregroundServiceStartNotification,
  foregroundServiceStopNotification,
  foregroundServiceUpdateNotification,
} from "@/lib/utils/notification.utils";
import { uploadFile } from "@/lib/utils/tus.utils";
import { Ionicons } from "@expo/vector-icons";
import notifee, { AuthorizationStatus } from "@notifee/react-native";
import { useQueryClient } from "@tanstack/react-query";
import { AudioModule, AudioQuality, IOSOutputFormat, RecordingOptions, useAudioRecorder, useAudioRecorderState } from "expo-audio";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { default as React, useEffect, useRef, useState } from "react";
import { Alert, Animated, Easing, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from "react-native";

export const STT_RECORDING_OPTIONS: RecordingOptions = {
  extension: ".m4a",
  sampleRate: 44100,
  numberOfChannels: 1, // <<<<---- this needs to be one
  bitRate: 64000,
  android: {
    extension: ".3gp",
    outputFormat: "3gp",
    audioEncoder: "amr_nb",
  },
  ios: {
    audioQuality: AudioQuality.MIN,
    outputFormat: IOSOutputFormat.MPEG4AAC,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: "audio/webm",
    bitsPerSecond: 128000,
  },
};

const RecordInterview: React.FC = () => {
  const router = useRouter();
  const { jobPositionId } = useLocalSearchParams();

  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { mutateAsync } = useCreateTimelineInterviewAnalyse(queryClient, user?.accessToken);

  const audioRecorder = useAudioRecorder(STT_RECORDING_OPTIONS);
  const audioRecorderState = useAudioRecorderState(audioRecorder, 1000);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [notificationId, setNotificationId] = useState<string | null>(null);
  const [progressPct, setProgressPct] = useState<number | boolean>(false);

  useEffect(() => {
    (async () => await requestPermission())();
  }, []);

  // Animation refs
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim1 = useRef(new Animated.Value(0)).current;
  const waveAnim2 = useRef(new Animated.Value(0)).current;
  const waveAnim3 = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Start pulse animation when recording
  useEffect(() => {
    if (isRecording && !isPaused) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

      const waveAnimation1 = Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim1, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim1, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

      const waveAnimation2 = Animated.loop(
        Animated.sequence([
          Animated.delay(500),
          Animated.timing(waveAnim2, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim2, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

      const waveAnimation3 = Animated.loop(
        Animated.sequence([
          Animated.delay(1000),
          Animated.timing(waveAnim3, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim3, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

      pulseAnimation.start();
      waveAnimation1.start();
      waveAnimation2.start();
      waveAnimation3.start();

      return () => {
        pulseAnimation.stop();
        waveAnimation1.stop();
        waveAnimation2.stop();
        waveAnimation3.stop();
      };
    }
  }, [isRecording, isPaused]);

  if (!user) return null;

  const requestPermission = async (): Promise<boolean> => {
    // request permissions for recording (audio)
    const permissionResponse = await AudioModule.requestRecordingPermissionsAsync();
    if (!permissionResponse.granted) {
      AlertPolyfill("Missing permission", "Permission to access microphone was denied");
      return false;
    }

    // in android, it uses foreground service, so it requires notification
    const settings = await notifee.getNotificationSettings();
    const isAndroid = Platform.OS === "android";
    const isNotificationDenfied = settings.authorizationStatus == AuthorizationStatus.DENIED;
    if (isAndroid && isNotificationDenfied) {
      AlertPolyfill("Missing permission", "Permission to show notification was denied");
      return false;
    }

    await AudioModule.setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: "duckOthers",
      interruptionModeAndroid: "duckOthers",
    });

    return true;
  };

  const startRecording = async () => {
    setNotificationId(await foregroundServiceStartNotification("Recording", "Good luck!"));
    try {
      if (!(await requestPermission())) {
        return;
      }

      setIsRecording(true);

      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();

      // Scale animation for button press
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (err) {
      console.error("Failed to start recording", err);
      Alert.alert("Error", "Failed to start recording. Please try again.");
    }
  };

  const pauseRecording = async () => {
    try {
      audioRecorder.pause();
      setIsPaused(true);
    } catch (err) {
      console.error("Failed to pause recording", err);
    }
  };

  const resumeRecording = async () => {
    try {
      audioRecorder.record();
      setIsPaused(false);
    } catch (err) {
      console.error("Failed to resume recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      console.log(audioRecorder);
      console.log(audioRecorder.uri);

      setIsRecording(false);
      setIsPaused(false);

      setProgressPct(0);
      const filename = `${user.id}/${Date.now()}.m4a`;

      const onProgress = async (bytesUploaded: number, bytesTotal: number) => {
        const uploaded = Math.min(bytesUploaded, bytesTotal); // avoids going above 100%
        const percentage = Math.round((uploaded / bytesTotal) * 100);
        const title = "Uploading recording";
        const body = `current progress: ${percentage}%`;
        setProgressPct(percentage);
        await foregroundServiceUpdateNotification(notificationId!, title, body);
      };

      await uploadFile(user, "interviews", filename, audioRecorder, onProgress);
      const timelineItem = await mutateAsync({ positionId: jobPositionId as string, interviewPath: filename });

      router.replace(jobPositionId ? `/job-position/${jobPositionId}/timeline/${timelineItem.id}` : `/interview/${timelineItem.id}`);
    } catch (err) {
      console.error("Failed to stop recording", err);
      Alert.alert("Error", "Failed to stop recording. Please try again.");
    } finally {
      await foregroundServiceStopNotification(notificationId!);
    }
  };

  const wave1Scale = waveAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.4],
  });

  const wave2Scale = waveAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.6],
  });

  const wave3Scale = waveAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.8],
  });

  const wave1Opacity = waveAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0],
  });

  const wave2Opacity = waveAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0],
  });

  const wave3Opacity = waveAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0],
  });

  const handleBack = () => router.push({ pathname: `/interview/create-interview-analyse-step1`, params: { jobPositionId } });
  const handleCancel = () => (jobPositionId ? router.push(`/job-position`) : router.push("/interview"));

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <MainContainer>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <TitleBackHeader pageTitle="Record Interview" handleBack={handleBack} handleCancel={handleCancel} />

          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40 }}>
            {/* Recording Animation Container */}
            <View
              style={{
                alignItems: "center",
                marginBottom: 60,
              }}
            >
              {/* Animated Waves - only show when recording */}
              {isRecording && !isPaused && (
                <>
                  <Animated.View
                    style={{
                      position: "absolute",
                      width: 300,
                      height: 300,
                      borderRadius: 150,
                      backgroundColor: "#FFC629",
                      opacity: wave3Opacity,
                      transform: [{ scale: wave3Scale }],
                    }}
                  />

                  <Animated.View
                    style={{
                      position: "absolute",
                      width: 250,
                      height: 250,
                      borderRadius: 125,
                      backgroundColor: "#FFC629",
                      opacity: wave2Opacity,
                      transform: [{ scale: wave2Scale }],
                    }}
                  />

                  <Animated.View
                    style={{
                      position: "absolute",
                      width: 200,
                      height: 200,
                      borderRadius: 100,
                      backgroundColor: "#FFC629",
                      opacity: wave1Opacity,
                      transform: [{ scale: wave1Scale }],
                    }}
                  />
                </>
              )}

              {/* Main Recording Button */}
              <Animated.View
                style={{
                  transform: [{ scale: scaleAnim }, { scale: isRecording && !isPaused ? pulseAnim : 1 }],
                }}
              >
                <TouchableOpacity
                  onPress={isRecording ? (isPaused ? resumeRecording : pauseRecording) : startRecording}
                  style={{
                    width: 160,
                    height: 160,
                    borderRadius: 80,
                    backgroundColor: isRecording ? (isPaused ? "#F59E0B" : "#EF4444") : "#FFC629",
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: isRecording ? (isPaused ? "#F59E0B" : "#EF4444") : "#FFC629",
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.4,
                    shadowRadius: 20,
                    elevation: 12,
                  }}
                >
                  <Ionicons name={isRecording ? (isPaused ? "play" : "pause") : "mic"} size={60} color="white" />
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Status and Timer */}
            <View style={{ alignItems: "center", marginBottom: 40 }}>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "800",
                  color: "#1D252C",
                  marginBottom: 8,
                }}
              >
                {isRecording ? (isPaused ? "Paused" : "Recording...") : "Ready to Record"}
              </Text>

              {isRecording && (
                <Text
                  style={{
                    fontSize: 48,
                    fontWeight: "700",
                    color: "#FFC629",
                    fontFamily: "monospace",
                    marginBottom: 16,
                  }}
                >
                  {formatTime(audioRecorderState.durationMillis / 1000)}
                </Text>
              )}

              <Text
                style={{
                  fontSize: 16,
                  color: "#6B7280",
                  textAlign: "center",
                  lineHeight: 24,
                }}
              >
                {isRecording
                  ? isPaused
                    ? "Tap to resume recording"
                    : "Tap to pause recording"
                  : "Tap the microphone to start your interview recording"}
              </Text>
            </View>

            {/* Recording Controls */}
            {isRecording && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <TouchableOpacity
                  onPress={stopRecording}
                  style={{
                    backgroundColor: "white",
                    borderRadius: 16,
                    paddingVertical: 16,
                    paddingHorizontal: 24,
                    flexDirection: "row",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
                >
                  <Ionicons name="stop" size={20} color="#EF4444" style={{ marginRight: 8 }} />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#EF4444",
                    }}
                  >
                    Stop & Save
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Tips Section */}
            {!isRecording && (
              <View
                style={{
                  position: "absolute",
                  bottom: 40,
                  left: 40,
                  right: 40,
                }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    borderRadius: 16,
                    padding: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      marginBottom: 12,
                    }}
                  >
                    <Ionicons name="bulb" size={20} color="#FFC629" style={{ marginRight: 12, marginTop: 2 }} />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: "#1D252C",
                      }}
                    >
                      Recording Tips
                    </Text>
                  </View>

                  <Text
                    style={{
                      fontSize: 14,
                      color: "#6B7280",
                      lineHeight: 20,
                    }}
                  >
                    • Find a quiet environment{"\n"}• Speak clearly and at normal pace{"\n"}• Keep your device close but not too close{"\n"}
                    • Take your time to think before answering
                  </Text>
                </View>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </MainContainer>

      <UploadProgressDialog progress={progressPct} />
    </>
  );
};

export default RecordInterview;
