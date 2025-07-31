// @ts-types="npm:@types/express@5.0.3"
// @ts-types="./types/express.d.ts"

import express from "express";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsContext } from "./middlewares/cors.middleware.ts";
import { supabaseContext } from "./middlewares/supabaseContext.middleware.ts";
import careerProfile from "./routes/careerProfile.route.ts";

const app = express();
const port = 3000;

app.use(corsContext);
app.use(express.json({ limit: "1mb" }));
app.use(supabaseContext);

app.use("/api/career-profiles", careerProfile);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
