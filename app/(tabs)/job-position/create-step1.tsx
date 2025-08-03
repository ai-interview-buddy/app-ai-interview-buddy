import { MainContainer } from "@/components/container/MainContainer";
import { CenteredTextHeading } from "@/components/headers/CenteredTextHeading";
import { TitleBackHeader } from "@/components/headers/TitleBackHeader";
import { StepIndicator } from "@/components/misc/StepIndicator";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack, useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";

export type JobPositionCreationMethod = "jobUrl" | "jobDescription" | null;

const CreateStep1: React.FC = () => {
  const router = useRouter();

  const handleCancel = () => router.push("/job-position");

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <MainContainer>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <TitleBackHeader pageTitle="New Position" handleBack={handleCancel} handleCancel={handleCancel} />

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 40,
            }}
            showsVerticalScrollIndicator={false}
          >
            <StepIndicator currentStep={1} totalSteps={2} />
            <CenteredTextHeading title="How would you like to create?" subtitle="Choose your preferred method to add a new job position" />

            <View style={{ gap: 16 }}>
              <Link href={"/job-position/create-step2-job-url"} push asChild>
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
                      <Ionicons name="link" size={24} color="#E3AA1F" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 18, fontWeight: "700", color: "#1D252C", marginBottom: 4 }}>From Job URL</Text>
                      <Text style={{ fontSize: 14, color: "#6B7280", lineHeight: 20 }}>
                        Paste a job posting URL and we'll extract all the details automatically
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>
              </Link>
              <Link href={"/job-position/create-step2-job-description"} push asChild>
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
                      <Ionicons name="document-text" size={24} color="#E3AA1F" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 18, fontWeight: "700", color: "#1D252C", marginBottom: 4 }}>From Description</Text>
                      <Text style={{ fontSize: 14, color: "#6B7280", lineHeight: 20 }}>
                        Paste the job description and we'll extract the key information
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
