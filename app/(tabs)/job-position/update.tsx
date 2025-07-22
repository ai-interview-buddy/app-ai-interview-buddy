import { MainContainer } from "@/components/container/MainContainer";
import { FormControl, FormControlError, FormControlErrorText, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { ChevronDownIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";

// Types
type CareerTrack = "FRONTEND" | "BACKEND" | "FULLSTACK" | "MOBILE" | "DEVOPS" | "DATA" | "DESIGN" | "PRODUCT" | "QA";

type JobPosition = {
  id: string;
  careerTrack: CareerTrack;
  companyName: string;
  companyLogo?: string;
  companyWebsite?: string;
  jobTitle: string;
  jobDescription: string;
  salaryRange?: string;
  expectedSalary?: string;
  fileList: any[];
  offerReceived: boolean;
};

type FormData = {
  careerTrack: CareerTrack;
  companyName: string;
  companyWebsite: string;
  jobTitle: string;
  jobDescription: string;
  expectedSalary: string;
};

type FormErrors = {
  careerTrack?: string;
  companyName?: string;
  companyWebsite?: string;
  jobTitle?: string;
  jobDescription?: string;
  expectedSalary?: string;
};

const careerTrackOptions = [
  { label: "Frontend Developer", value: "FRONTEND" },
  { label: "Backend Developer", value: "BACKEND" },
  { label: "Full Stack Developer", value: "FULLSTACK" },
  { label: "Mobile Developer", value: "MOBILE" },
  { label: "DevOps Engineer", value: "DEVOPS" },
  { label: "Data Scientist", value: "DATA" },
  { label: "UI/UX Designer", value: "DESIGN" },
  { label: "Product Manager", value: "PRODUCT" },
  { label: "QA Engineer", value: "QA" },
];

const UpdateJobPosition: React.FC = () => {
  const { colorScheme } = useColorScheme();
  const barStyle = colorScheme === "dark" ? "light-content" : "dark-content";
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    careerTrack: "FRONTEND",
    companyName: "",
    companyWebsite: "",
    jobTitle: "",
    jobDescription: "",
    expectedSalary: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Load existing job position data
  useEffect(() => {
    const loadJobPosition = async () => {
      try {
        // Simulate API call - replace with actual API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockJobPosition: JobPosition = {
          id: (id as string) || "1",
          careerTrack: "FRONTEND",
          companyName: "TechCorp Inc.",
          companyLogo: "https://ui-avatars.com/api/?name=TechCorp+Inc&background=f3f4f6&color=6b7280&size=80",
          companyWebsite: "https://techcorp.com",
          jobTitle: "Senior Frontend Developer",
          jobDescription:
            "We are looking for a passionate Senior Frontend Developer to join our growing team. You will be responsible for building user-facing features using React, TypeScript, and modern web technologies.",
          salaryRange: "$90,000-120,000",
          expectedSalary: "$105,000",
          fileList: [],
          offerReceived: false,
        };

        setFormData({
          careerTrack: mockJobPosition.careerTrack,
          companyName: mockJobPosition.companyName,
          companyWebsite: mockJobPosition.companyWebsite || "",
          jobTitle: mockJobPosition.jobTitle,
          jobDescription: mockJobPosition.jobDescription,
          expectedSalary: mockJobPosition.expectedSalary || "",
        });
      } catch (error) {
        console.error("Error loading job position:", error);
        Alert.alert("Error", "Failed to load job position details");
      } finally {
        setLoading(false);
      }
    };

    loadJobPosition();
  }, [id]);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.careerTrack) {
      newErrors.careerTrack = "Career track is required";
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required";
    }

    if (!formData.jobDescription.trim()) {
      newErrors.jobDescription = "Job description is required";
    }

    if (formData.companyWebsite && !isValidUrl(formData.companyWebsite)) {
      newErrors.companyWebsite = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert("Success", "Job position updated successfully!", [{ text: "OK", onPress: () => router.back() }]);
    } catch (error) {
      Alert.alert("Error", "Failed to update job position. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FEFBED" }}>
        <StatusBar barStyle={barStyle} backgroundColor="#FEFBED" />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 16, color: "#6B7280", fontWeight: "500" }}>Loading position details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <MainContainer>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 24,
          }}
        >
          <TouchableOpacity
            onPress={handleCancel}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 1,
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#1D252C" />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#1D252C",
            }}
          >
            Update Position
          </Text>

          <TouchableOpacity onPress={handleCancel} style={{ paddingVertical: 8, paddingHorizontal: 16 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#6B7280",
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 20,
              padding: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            {/* Career Track Select */}
            <FormControl isInvalid={!!errors.careerTrack} style={{ marginBottom: 24 }}>
              <FormControlLabel>
                <FormControlLabelText
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#1D252C",
                    marginBottom: 8,
                  }}
                >
                  Career Track *
                </FormControlLabelText>
              </FormControlLabel>

              <Select selectedValue={formData.careerTrack} onValueChange={(value) => handleInputChange("careerTrack", value)}>
                <SelectTrigger
                //   style={{
                //     backgroundColor: "#F8F9FA",
                //     borderRadius: 12,
                //     borderWidth: 1,
                //     borderColor: errors.careerTrack ? "#EF4444" : "#E5E7EB",
                //     paddingHorizontal: 16,
                //     paddingVertical: 16,
                //   }}
                >
                  <SelectInput
                    placeholder="Select career track"
                    // style={{
                    //   fontSize: 16,
                    //   color: "#1D252C",
                    // }}
                  />
                  <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>

                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {careerTrackOptions.map((option) => (
                      <SelectItem key={option.value} label={option.label} value={option.value} />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>

              {errors.careerTrack && (
                <FormControlError>
                  <FormControlErrorText style={{ color: "#EF4444", fontSize: 14 }}>{errors.careerTrack}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            {/* Company Name */}
            <FormControl isInvalid={!!errors.companyName} style={{ marginBottom: 24 }}>
              <FormControlLabel>
                <FormControlLabelText
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#1D252C",
                    marginBottom: 8,
                  }}
                >
                  Company Name *
                </FormControlLabelText>
              </FormControlLabel>

              <Input
                style={{
                  backgroundColor: "#F8F9FA",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: errors.companyName ? "#EF4444" : "#E5E7EB",
                }}
              >
                <InputField
                  value={formData.companyName}
                  onChangeText={(value) => handleInputChange("companyName", value)}
                  placeholder="Enter company name"
                  style={{
                    fontSize: 16,
                    color: "#1D252C",
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                  }}
                />
              </Input>

              {errors.companyName && (
                <FormControlError>
                  <FormControlErrorText style={{ color: "#EF4444", fontSize: 14 }}>{errors.companyName}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            {/* Company Website */}
            <FormControl isInvalid={!!errors.companyWebsite} style={{ marginBottom: 24 }}>
              <FormControlLabel>
                <FormControlLabelText
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#1D252C",
                    marginBottom: 8,
                  }}
                >
                  Company Website
                </FormControlLabelText>
              </FormControlLabel>

              <Input
                style={{
                  backgroundColor: "#F8F9FA",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: errors.companyWebsite ? "#EF4444" : "#E5E7EB",
                }}
              >
                <InputField
                  value={formData.companyWebsite}
                  onChangeText={(value) => handleInputChange("companyWebsite", value)}
                  placeholder="https://company.com"
                  keyboardType="url"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{
                    fontSize: 16,
                    color: "#1D252C",
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                  }}
                />
              </Input>

              {errors.companyWebsite && (
                <FormControlError>
                  <FormControlErrorText style={{ color: "#EF4444", fontSize: 14 }}>{errors.companyWebsite}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            {/* Job Title */}
            <FormControl isInvalid={!!errors.jobTitle} style={{ marginBottom: 24 }}>
              <FormControlLabel>
                <FormControlLabelText
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#1D252C",
                    marginBottom: 8,
                  }}
                >
                  Job Title *
                </FormControlLabelText>
              </FormControlLabel>

              <Input
                style={{
                  backgroundColor: "#F8F9FA",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: errors.jobTitle ? "#EF4444" : "#E5E7EB",
                }}
              >
                <InputField
                  value={formData.jobTitle}
                  onChangeText={(value) => handleInputChange("jobTitle", value)}
                  placeholder="Enter job title"
                  style={{
                    fontSize: 16,
                    color: "#1D252C",
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                  }}
                />
              </Input>

              {errors.jobTitle && (
                <FormControlError>
                  <FormControlErrorText style={{ color: "#EF4444", fontSize: 14 }}>{errors.jobTitle}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            {/* Job Description */}
            <FormControl isInvalid={!!errors.jobDescription} style={{ marginBottom: 24 }}>
              <FormControlLabel>
                <FormControlLabelText
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#1D252C",
                    marginBottom: 8,
                  }}
                >
                  Job Description *
                </FormControlLabelText>
              </FormControlLabel>

              <Textarea
                style={{
                  backgroundColor: "#F8F9FA",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: errors.jobDescription ? "#EF4444" : "#E5E7EB",
                  minHeight: 120,
                }}
              >
                <TextareaInput
                  value={formData.jobDescription}
                  onChangeText={(value) => handleInputChange("jobDescription", value)}
                  placeholder="Enter detailed job description"
                  style={{
                    fontSize: 16,
                    color: "#1D252C",
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    textAlignVertical: "top",
                  }}
                />
              </Textarea>

              {errors.jobDescription && (
                <FormControlError>
                  <FormControlErrorText style={{ color: "#EF4444", fontSize: 14 }}>{errors.jobDescription}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            {/* Expected Salary */}
            <FormControl isInvalid={!!errors.expectedSalary}>
              <FormControlLabel>
                <FormControlLabelText
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#1D252C",
                    marginBottom: 8,
                  }}
                >
                  Expected Salary
                </FormControlLabelText>
              </FormControlLabel>

              <Input
                style={{
                  backgroundColor: "#F8F9FA",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: errors.expectedSalary ? "#EF4444" : "#E5E7EB",
                }}
              >
                <InputField
                  value={formData.expectedSalary}
                  onChangeText={(value) => handleInputChange("expectedSalary", value)}
                  placeholder="$75,000"
                  style={{
                    fontSize: 16,
                    color: "#1D252C",
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                  }}
                />
              </Input>

              {errors.expectedSalary && (
                <FormControlError>
                  <FormControlErrorText style={{ color: "#EF4444", fontSize: 14 }}>{errors.expectedSalary}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          </View>
        </ScrollView>

        {/* Bottom Action Buttons */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            backgroundColor: "#FEFBED",
            gap: 12,
          }}
        >
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
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
              opacity: saving ? 0.7 : 1,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#1D252C",
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default UpdateJobPosition;
