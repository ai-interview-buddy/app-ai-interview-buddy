export const getScoreColor = (score: number): string => {
  if (score >= 8) return "#10B981";
  if (score >= 6) return "#F59E0B";
  if (score >= 4) return "#F97316";
  return "#EF4444";
};

export const getScoreLabel = (score: number): string => {
  if (score >= 8) return "Excellent";
  if (score >= 6) return "Good";
  if (score >= 4) return "Fair";
  return "Needs Work";
};

export const getAnalysisIcon = (item: string): string => {
  switch (item.toLowerCase()) {
    case "ats":
      return "scan";
    case "grammar":
      return "text";
    case "pages":
      return "document";
    case "structure":
      return "list";
    case "content":
      return "create";
    default:
      return "checkmark-circle";
  }
};

export const getAnalysisTitle = (item: string): string => {
  switch (item.toLowerCase()) {
    case "ats":
      return "ATS Compatibility";
    case "grammar":
      return "Grammar & Language";
    case "pages":
      return "Page Length";
    case "structure":
      return "Document Structure";
    case "content":
      return "Content Quality";
    default:
      return item.charAt(0).toUpperCase() + item.slice(1);
  }
};
