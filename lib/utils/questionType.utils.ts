import { QuestionType } from "@/supabase/functions/api/types/InterviewQuestion";

export const getQuestionTypeColor = (type: QuestionType): string => {
  switch (type) {
    case "TECHNICAL":
      return "#3B82F6";
    case "BEHAVIORAL":
      return "#8B5CF6";
    case "BACKGROUND_EXPERIENCE":
      return "#10B981";
    case "GREETING_OR_CHIT_CHAT":
      return "#1810b9ff";
    default:
      return "#6B7280";
  }
};

export const getQuestionTypeLabel = (type: QuestionType): string => {
  switch (type) {
    case "TECHNICAL":
      return "Technical";
    case "BEHAVIORAL":
      return "Behavioral";
    case "BACKGROUND_EXPERIENCE":
      return "Background";
    case "GREETING_OR_CHIT_CHAT":
      return "Greeting";
    default:
      return type;
  }
};

export const getScoreItemLabel = (): { key: string; label: string }[] => {
  return [
    { key: "structure", label: "Structure" },
    { key: "relevance", label: "Relevance" },
    { key: "clarityConciseness", label: "Clarity & Conciseness" },
    { key: "specificityDetail", label: "Specificity & Detail" },
    { key: "actionsContribution", label: "Actions & Contribution" },
    { key: "resultsImpact", label: "Results & Impact" },
    { key: "competencyDemonstration", label: "Competency Demo" },
  ];
};

export const getSentimentColor = (sentiment: string): string => {
  switch (sentiment) {
    case "positive":
      return "#22C55E";
    case "negative":
      return "#EF4444";
    default:
      return "#6B7280";
  }
};
