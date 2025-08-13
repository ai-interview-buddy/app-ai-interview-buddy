import { MainAction } from "@/components/button/MainAction";
import AlertPolyfill from "@/components/ui/alert-web/AlertPolyfill";
import { useCreateCareerProfile } from "@/lib/api/careerProfile.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { supabase } from "@/lib/supabase/supabase";
import { formatFileSize, getFileExtension } from "@/lib/utils/files.utils";
import { CareerProfile } from "@/supabase/functions/api/types/CareerProfile";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { DocumentPickerResult, getDocumentAsync } from "expo-document-picker";
import { default as React, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

type CareerProfileFormProps = {
  title: string;
  subtitle: string;
  maxFileSize?: number; // in bytes
  allowedTypes?: string[];
  onConfirm: (saved: CareerProfile) => Promise<void>;
};

const typeNames: { [key: string]: string } = {
  "application/pdf": "PDF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "audio/mpeg": ".mp3",
  "audio/mp4": ".mp4",
  "audio/aac": ".aac",
  "audio/wav": ".wav",
  "audio/flac": ".flac",
  "audio/pcm": ".pcm",
  "audio/x-m4a": ".m4a",
  "audio/ogg": ".ogg",
  "audio/opus": ".opus",
  "audio/webm": ".webm",
};

const CareerProfileForm = ({
  title,
  subtitle,
  maxFileSize = 5 * 1024 * 1024,
  allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  onConfirm,
}: CareerProfileFormProps) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { mutateAsync } = useCreateCareerProfile(queryClient, user?.accessToken);

  const [selectedFile, setSelectedFile] = useState<DocumentPickerResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const formattedSize = formatFileSize(maxFileSize);

  if (!user) return null;

  const handleFilePicker = async () => {
    try {
      const result = await getDocumentAsync({
        type: allowedTypes,
        copyToCacheDirectory: false,
        multiple: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document. Please try again.");
      console.error("Document picker error:", error);
    }
  };

  const handleSave = async () => {
    setUploading(true);
    try {
      if (!selectedFile || selectedFile.canceled) {
        AlertPolyfill("No File Selected", "Please select a CV file before saving.");
        setSelectedFile(null);
        return;
      }

      const file = selectedFile.assets[0];
      const ext = getFileExtension(file.name || file.uri);
      const mimeType = file.mimeType || "";

      if (!allowedTypes.includes(mimeType)) {
        AlertPolyfill("Invalid file type", `You have selected a file ${ext} [${mimeType}]`);
        setSelectedFile(null);
        return;
      }

      if ((file.size || 0) > maxFileSize) {
        AlertPolyfill("File Too Large", `Please select a file smaller than ${formattedSize}.`);
        setSelectedFile(null);
        return;
      }

      const arraybuffer = await fetch(file.uri).then((res) => res.arrayBuffer());
      const fileExt = (file.name || file.uri)?.split(".").pop()?.toLowerCase() ?? "pdf";
      const curriculumPath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage.from("curriculums").upload(curriculumPath, arraybuffer, {
        contentType: file.mimeType,
      });
      if (error) throw error;

      const saved = await mutateAsync({ curriculumPath });
      await onConfirm(saved);
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = getFileExtension(fileName);
    switch (extension) {
      case "pdf":
        return "document-text";
      case "doc":
      case "docx":
        return "document";
      default:
        return "document-outline";
    }
  };

  const supportedFormats = allowedTypes.map((el) => typeNames[el] || el).join(", ");

  return (
    <View>
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 24,
          padding: 32,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        {/* Upload Icon */}
        <View
          style={{
            width: 120,
            height: 120,
            backgroundColor: "#FFF7DE",
            borderRadius: 60,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <Ionicons
            name={selectedFile && !selectedFile.canceled ? "checkmark-circle" : "cloud-upload"}
            size={56}
            color={selectedFile && !selectedFile.canceled ? "#10B981" : "#E3AA1F"}
          />
        </View>

        {/* Title/SubTitle */}
        <Text style={{ fontSize: 24, fontWeight: "800", color: "#1D252C", textAlign: "center", marginBottom: 12 }}>{title}</Text>
        <Text style={{ fontSize: 16, color: "#6B7280", textAlign: "center", lineHeight: 24, marginBottom: 32 }}>{subtitle}</Text>

        {/* File Selection Area */}
        {selectedFile && !selectedFile.canceled && selectedFile.assets ? (
          <View
            style={{
              width: "100%",
              backgroundColor: "#F8F9FA",
              borderRadius: 16,
              padding: 20,
              marginBottom: 32,
              borderWidth: 2,
              borderColor: "#10B981",
              borderStyle: "dashed",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "#10B981" + "20",
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 16,
                }}
              >
                <Ionicons name={getFileIcon(selectedFile.assets[0].name) as any} size={20} color="#10B981" />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#1D252C",
                    marginBottom: 4,
                  }}
                  numberOfLines={1}
                >
                  {selectedFile.assets[0].name}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#6B7280",
                  }}
                >
                  {selectedFile.assets[0].size ? formatFileSize(selectedFile.assets[0].size) : "Unknown size"}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setSelectedFile(null)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: "#FEF2F2",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="close" size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleFilePicker}
            style={{
              width: "100%",
              backgroundColor: "#F8F9FA",
              borderRadius: 16,
              padding: 24,
              marginBottom: 32,
              borderWidth: 2,
              borderColor: "#E5E7EB",
              borderStyle: "dashed",
              alignItems: "center",
            }}
          >
            <Ionicons name="add" size={32} color="#9CA3AF" style={{ marginBottom: 12 }} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#6B7280",
                marginBottom: 4,
              }}
            >
              Choose File
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#9CA3AF",
                textAlign: "center",
              }}
            >
              {supportedFormats} files only
            </Text>
          </TouchableOpacity>
        )}

        <MainAction
          onPress={handleSave}
          disabled={uploading || !selectedFile || selectedFile.canceled}
          isLoading={uploading}
          loadingText={<>Analyzing CV...</>}
        />

        {/* Supported formats info */}
        <Text style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center", marginTop: 16, lineHeight: 18 }}>
          Supported formats: {supportedFormats + "\n"}
          Maximum file size: {formattedSize}
        </Text>
      </View>
    </View>
  );
};

export default CareerProfileForm;
