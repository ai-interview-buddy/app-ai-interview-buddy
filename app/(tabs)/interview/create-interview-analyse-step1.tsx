import { MainContainer } from "@/components/container/MainContainer";
import { CenteredTextHeading } from "@/components/headers/CenteredTextHeading";
import { TitleBackHeader } from "@/components/headers/TitleBackHeader";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";

const CreateStep1: React.FC = () => {
  const router = useRouter();
  const { positionId } = useLocalSearchParams();

  const handleBack = () => (positionId ? router.push(`/job-position/${positionId}`) : router.push("/interview/create-interview"));
  const handleCancel = () => (positionId ? router.push(`/job-position`) : router.push("/interview/create-interview"));

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
            <CenteredTextHeading
              title="How would you like to capture the interview?"
              subtitle="Choose to record in-app or import an existing audio file"
            />

            <View style={{ gap: 16 }}>
              <Link
                href={{
                  pathname: "/interview/create-interview-analyse-step2-record",
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
                      <Ionicons name="mic-outline" size={24} color="#E3AA1F" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 18, fontWeight: "700", color: "#1D252C", marginBottom: 4 }}>Record Interview</Text>
                      <Text style={{ fontSize: 14, color: "#6B7280", lineHeight: 20 }}>
                        Use your device&apos;s microphone to capture live audio
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>
              </Link>
              <Link
                href={{
                  pathname: "/interview/create-interview-analyse-step2-upload",
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

export default CreateStep1;
