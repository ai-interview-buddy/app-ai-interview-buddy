import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { app } from "./app.ts";

addEventListener("beforeunload", (ev: unknown) => {
  console.log("Function will be shutdown due to", ev);
});

const port = 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
