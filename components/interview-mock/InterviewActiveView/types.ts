import { DeepgramParagraph } from "@/supabase/functions/api/types/InterviewQuestion";
import { MockInterviewResponse } from "@/supabase/functions/api/types/MockInterview";

export interface InterviewActiveViewProps {
  mockInterviewResponse: MockInterviewResponse | null;
  handleEndInterview: (transcript: DeepgramParagraph[]) => void;
}
