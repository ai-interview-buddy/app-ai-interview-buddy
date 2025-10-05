import UploadFileForm from "@/components/data-input/UploadFileForm";
import { useCreateCareerProfile } from "@/lib/api/careerProfile.query";
import { useAuthStore } from "@/lib/supabase/authStore";
import { supabase } from "@/lib/supabase/supabase";
import { CareerProfile } from "@/supabase/functions/api/types/CareerProfile";
import { useQueryClient } from "@tanstack/react-query";
import { DocumentPickerAsset } from "expo-document-picker";
import { default as React } from "react";

type CareerProfileFormProps = {
  onConfirm: (saved: CareerProfile) => Promise<void>;
};

const CareerProfileForm = ({ onConfirm }: CareerProfileFormProps) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { mutateAsync } = useCreateCareerProfile(queryClient, user?.accessToken);

  if (!user) return null;

  const handleSave = async (file: DocumentPickerAsset) => {
    const arraybuffer = await fetch(file.uri).then((res) => res.arrayBuffer());
    const fileExt = (file.name || file.uri)?.split(".").pop()?.toLowerCase() ?? "pdf";
    const curriculumPath = `${user.id}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage.from("curriculums").upload(curriculumPath, arraybuffer, {
      contentType: file.mimeType,
    });
    if (error) throw error;

    const saved = await mutateAsync({ curriculumPath });
    await onConfirm(saved);
  };

  return (
    <UploadFileForm
      title="Please select your CV"
      subtitle="Upload your resume to get a detailed analysis and personalized recommendations"
      allowedTypes={["application/pdf"]}
      maxFileSize={5 * 1024 * 1024}
      onConfirm={handleSave}
    />
  );
};

export default CareerProfileForm;
