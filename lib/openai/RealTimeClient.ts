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
        // include: ["item.input_audio_transcription.logprobs"],
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

  public static parseMessage(
    e: any,
    callbacks?: {
      setIsAISpeaking?: (speaking: boolean) => void;
      setCurrentQuestion?: (updater: (prev: string) => string) => void;
      // State updaters for chronological transcript tracking
      setItemOrder?: (updater: (prev: string[]) => string[]) => void;
      setMessagesMap?: (updater: (prev: Record<string, any>) => Record<string, any>) => void;
      processedEventIds?: Set<string>;
      sessionStartTime?: number;
    }
  ): void {
    try {
      const event = JSON.parse(e.data);

      if (event.type === "error") {
        console.error("RTC: OpenAI Error:", JSON.stringify(event.error, null, 2));
        return;
      }

      const getRelativeTime = () => {
        if (!callbacks?.sessionStartTime) return 0;
        return (Date.now() - callbacks.sessionStartTime) / 1000;
      };

      // Voice Activity / Audio Buffer Handling
      if (event.type === "output_audio_buffer.started") {
        callbacks?.setIsAISpeaking?.(true);
      } else if (event.type === "output_audio_buffer.stopped" || event.type === "output_audio_buffer.cleared") {
        callbacks?.setIsAISpeaking?.(false);
      }

      // Conversation Item Handling (Order tracking)
      if (event.type === "conversation.item.added") {
        const item = event.item;
        if (item && (item.role === "user" || item.role === "assistant")) {
          const itemId = item.id;
          const role = item.role as "user" | "assistant";
          const startTime = getRelativeTime();

          callbacks?.setItemOrder?.((prev) => {
            if (prev.includes(itemId)) return prev;
            return [...prev, itemId];
          });

          callbacks?.setMessagesMap?.((prev) => ({
            ...prev,
            [itemId]: {
              speaker: role === "assistant" ? 0 : 1,
              sentences: [],
              start: startTime,
              end: startTime,
              sentiment: "neutral",
            },
          }));
        }
      }

      // Transcript handling for the "current question"
      if (event.type === "response.created") {
        callbacks?.setCurrentQuestion?.(() => "");
      } else if (event.type === "response.output_audio_transcript.delta") {
        callbacks?.setCurrentQuestion?.((prev) => prev + (event.delta || ""));
      } else if (event.type === "response.output_audio_transcript.done") {
        const transcript = event.transcript || "";
        const itemId = event.item_id;
        const eventId = event.event_id;
        const endTime = getRelativeTime();

        callbacks?.setCurrentQuestion?.(() => transcript);

        if (callbacks?.processedEventIds?.has(eventId)) return;
        callbacks?.processedEventIds?.add(eventId);

        callbacks?.setMessagesMap?.((prev) => {
          const existing = prev[itemId] || {
            speaker: 0,
            sentences: [],
            start: endTime,
            end: endTime,
            sentiment: "neutral",
          };
          return {
            ...prev,
            [itemId]: {
              ...existing,
              sentences: [{ text: transcript, start: existing.start, end: endTime }],
              end: endTime,
            },
          };
        });
      } else if (event.type === "conversation.item.input_audio_transcription.completed") {
        const transcript = event.transcript || "";
        const itemId = event.item_id;
        const eventId = event.event_id;
        const endTime = getRelativeTime();

        if (callbacks?.processedEventIds?.has(eventId)) return;
        callbacks?.processedEventIds?.add(eventId);

        callbacks?.setMessagesMap?.((prev) => {
          const existing = prev[itemId] || {
            speaker: 1,
            sentences: [],
            start: endTime,
            end: endTime,
            sentiment: "neutral",
          };
          return {
            ...prev,
            [itemId]: {
              ...existing,
              sentences: [{ text: transcript, start: existing.start, end: endTime }],
              end: endTime,
            },
          };
        });
      }
    } catch (err) {
      console.error("RTC: Received (not JSON or error parsing):", e.data);
    }
  }
}
