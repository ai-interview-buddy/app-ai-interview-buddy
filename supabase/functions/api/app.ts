import express from "express";
import { corsContext } from "./middlewares/cors.middleware.ts";
import { supabaseContext } from "./middlewares/supabaseContext.middleware.ts";
import account from "./routes/account.route.ts";
import careerProfile from "./routes/careerProfile.route.ts";
import interviewQuestion from "./routes/interviewQuestion.route.ts";
import jobPosition from "./routes/jobPosition.route.ts";
import mockInterview from "./routes/mockInterview.route.ts";
import timelineItem from "./routes/timelineItem.route.ts";

export const app = express();

app.use(corsContext);
app.use(express.json({ limit: "1mb" }));
app.use(supabaseContext);

app.use("/api/career-profiles", careerProfile);
app.use("/api/job-positions", jobPosition);
app.use("/api/timeline-items", timelineItem);
app.use("/api/interview-questions", interviewQuestion);
app.use("/api/account", account);
app.use("/api/mock-interview", mockInterview);
