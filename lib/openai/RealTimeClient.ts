export default class RealTimeClient {
  public static async createConnection(sdp: any, token: string): Promise<any> {
    const baseUrl = "https://api.openai.com/v1/realtime/calls";
    const model = "gpt-4o-realtime-preview-2024-12-17";

    try {
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: sdp,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/sdp",
        },
      });

      if (!sdpResponse.ok) {
        const raw = await sdpResponse.text().catch(() => "");
        let parsed: any = raw;
        try {
          parsed = raw ? JSON.parse(raw) : raw;
        } catch {
          // leave parsed as raw text
        }

        console.error("RTC: SDP exchange failed", {
          status: sdpResponse.status,
          error: parsed,
        });

        throw new Error(`OpenAI realtime SDP request failed (${sdpResponse.status})`);
      }

      const answer = {
        type: "answer",
        sdp: await sdpResponse.text(),
      };

      return answer;
    } catch (err) {
      console.error("RTC: Failed to create connection", err);
      throw err;
    }
  }

  public static openEvent(): string {
    console.log("RTC: Data channel open");

    const event = {
      type: "session.update",
      session: {
        type: "realtime",
        include: ["item.input_audio_transcription.logprobs"],
      },
    };
    return JSON.stringify(event);
  }

  public static forceStartEvent(): string {
    return JSON.stringify({ type: "response.create" });
  }

  public static responseCreateEvent(): string {
    return JSON.stringify({
      type: "response.create",
      response: {
        modalities: ["audio", "text"],
      },
    });
  }

  public static parseMessage(e: any): void {
    try {
      const event = JSON.parse(e.data);

      if (event.type === "error") {
        console.error("RTC: OpenAI Error:", JSON.stringify(event.error, null, 2));
      } else {
        console.log("RTC: Received from OpenAI:", e.data);
      }
    } catch (err) {
      console.error("RTC: Received (not JSON):", e.data);
    }
  }
}
