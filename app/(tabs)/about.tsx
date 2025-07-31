import { MainContainer } from "@/components/container/MainContainer";
import { TitleBackHeader } from "@/components/headers/TitleBackHeader";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

type CreationMethod = "url" | "description" | null;

const CreateJobPosition: React.FC = () => {
  const { colorScheme } = useColorScheme();
  const barStyle = colorScheme === "dark" ? "light-content" : "dark-content";
  const router = useRouter();

  // State
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [creationMethod, setCreationMethod] = useState<CreationMethod>(null);
  const [urlInput, setUrlInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleMethodSelection = (method: CreationMethod) => {
    setCreationMethod(method);
    setCurrentStep(2);
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      setCreationMethod(null);
      setUrlInput("");
      setDescriptionInput("");
    }
  };

  const handleSave = async () => {
    const inputValue = creationMethod === "url" ? urlInput : descriptionInput;

    if (!inputValue.trim()) {
      Alert.alert("Error", `Please enter a ${creationMethod === "url" ? "URL" : "job description"}`);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      Alert.alert("Success", "Job position created successfully!", [{ text: "OK", onPress: () => router.push("/") }]);
    } catch (error) {
      Alert.alert("Error", "Failed to create job position. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 32,
      }}
    >
      {[1, 2].map((step) => (
        <React.Fragment key={step}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: currentStep >= step ? "#FFC629" : "#F3F4F6",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: currentStep >= step ? "#1D252C" : "#9CA3AF",
              }}
            >
              {step}
            </Text>
          </View>
          {step < 2 && (
            <View
              style={{
                width: 40,
                height: 2,
                backgroundColor: currentStep > step ? "#FFC629" : "#F3F4F6",
                marginHorizontal: 8,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "800",
          color: "#1D252C",
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        How would you like to create?
      </Text>

      <Text
        style={{
          fontSize: 16,
          color: "#6B7280",
          textAlign: "center",
          marginBottom: 48,
          lineHeight: 24,
        }}
      >
        Choose your preferred method to add a new job position
      </Text>

      <View style={{ gap: 16 }}>
        {/* From Job URL Option */}
        <TouchableOpacity
          onPress={() => handleMethodSelection("url")}
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
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#1D252C",
                  marginBottom: 4,
                }}
              >
                From Job URL
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#6B7280",
                  lineHeight: 20,
                }}
              >
                Paste a job posting URL and we'll extract all the details automatically
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </View>
        </TouchableOpacity>

        {/* From Description Option */}
        <TouchableOpacity
          onPress={() => handleMethodSelection("description")}
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
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#1D252C",
                  marginBottom: 4,
                }}
              >
                From Description
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#6B7280",
                  lineHeight: 20,
                }}
              >
                Paste the job description and we'll extract the key information
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "800",
          color: "#1D252C",
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        {creationMethod === "url" ? "Enter Job URL" : "Enter Job Description"}
      </Text>

      <Text
        style={{
          fontSize: 16,
          color: "#6B7280",
          textAlign: "center",
          marginBottom: 32,
          lineHeight: 24,
        }}
      >
        {creationMethod === "url" ? "Paste the job posting URL below" : "Paste the complete job description below"}
      </Text>

      <View style={{ flex: 1 }}>
        {creationMethod === "url" ? (
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
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#1D252C",
                marginBottom: 12,
              }}
            >
              Job Posting URL
            </Text>
            <TextInput
              value={urlInput}
              onChangeText={setUrlInput}
              placeholder="https://company.com/jobs/position"
              style={{
                fontSize: 16,
                color: "#1D252C",
                paddingVertical: 16,
                paddingHorizontal: 16,
                backgroundColor: "#F8F9FA",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
              placeholderTextColor="#9CA3AF"
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        ) : (
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 20,
              flex: 1,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#1D252C",
                marginBottom: 12,
              }}
            >
              Job Description
            </Text>
            <TextInput
              value={descriptionInput}
              onChangeText={setDescriptionInput}
              placeholder="Paste the complete job description here..."
              style={{
                fontSize: 16,
                color: "#1D252C",
                padding: 16,
                backgroundColor: "#F8F9FA",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#E5E7EB",
                flex: 1,
                textAlignVertical: "top",
              }}
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={10}
            />
          </View>
        )}
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <MainContainer>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <TitleBackHeader pageTitle="New Position" handleBack={() => handleBack()} />

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 40,
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
          >
            {renderStepIndicator()}

            {currentStep === 1 ? renderStep1() : renderStep2()}
          </ScrollView>

          {/* Bottom Action Button - Only show in Step 2 */}
          {currentStep === 2 && (
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 20,
                backgroundColor: "#FEFBED",
              }}
            >
              <TouchableOpacity
                onPress={handleSave}
                disabled={isLoading}
                style={{
                  backgroundColor: "#FFC629",
                  borderRadius: 16,
                  paddingVertical: 18,
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#FFC629",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "700",
                        color: "#1D252C",
                        marginRight: 12,
                      }}
                    >
                      Processing...
                    </Text>
                  </View>
                ) : (
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: "#1D252C",
                    }}
                  >
                    Save Position
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingView>
      </MainContainer>
    </>
  );
};

export default CreateJobPosition;
