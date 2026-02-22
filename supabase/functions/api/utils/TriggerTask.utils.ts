class TriggerTaskService {
  async triggerTask(taskId: string, payload: Record<string, unknown>): Promise<void> {
    const triggerApiUrl = Deno.env.get("TRIGGER_API_URL") || "https://api.trigger.dev";
    const triggerSecretKey = Deno.env.get("TRIGGER_SECRET_KEY") || "";

    if (!triggerSecretKey) {
      console.warn(`triggerTask: TRIGGER_SECRET_KEY not set, skipping task ${taskId}`);
      return;
    }

    try {
      const res = await fetch(`${triggerApiUrl}/api/v1/tasks/${taskId}/trigger`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${triggerSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload }),
      });

      if (!res.ok) {
        const body = await res.text();
        console.error(`triggerTask: failed to trigger ${taskId}: ${res.status} ${body}`);
      } else {
        const result = await res.json();
        console.log(`triggerTask: triggered ${taskId}, run: ${result.id}`);
      }
    } catch (error) {
      console.error(`triggerTask: error triggering ${taskId}:`, error);
    }
  }
}

export default new TriggerTaskService();
