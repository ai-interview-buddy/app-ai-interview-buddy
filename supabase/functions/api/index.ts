import express from "express";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsContext } from "./middlewares/cors.middleware.ts";
import { supabaseContext } from "./middlewares/supabaseContext.middleware.ts";
import careerProfile from "./routes/careerProfile.route.ts";
import interviewQuestion from "./routes/interviewQuestion.route.ts";
import jobPosition from "./routes/jobPosition.route.ts";
import timelineItem from "./routes/timelineItem.route.ts";

addEventListener("beforeunload", (ev: unknown) => {
  console.log("Function will be shutdown due to", ev);
});

const app = express();
const port = 3000;

app.use(corsContext);
app.use(express.json({ limit: "1mb" }));
app.use(supabaseContext);

app.use("/api/career-profiles", careerProfile);
app.use("/api/job-positions", jobPosition);
app.use("/api/timeline-items", timelineItem);
app.use("/api/interview-questions", interviewQuestion);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
