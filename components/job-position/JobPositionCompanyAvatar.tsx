import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { JobPosition } from "@/supabase/functions/api/types/JobPosition";
import React from "react";

type Props = {
  record: JobPosition;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | undefined;
};

export const JobPositionCompanyAvatar = ({ record , size = "md" }: Props) => {
  return (
    <Avatar size={size} style={{ backgroundColor: "#F3F4F6", marginRight: 16 }}>
      {record.companyLogo ? (
        <AvatarImage resizeMode="contain" source={{ uri: record.companyLogo }} />
      ) : (
        <AvatarFallbackText style={{ color: "#1D252C" }}>{record.companyName}</AvatarFallbackText>
      )}
    </Avatar>
  );
};
