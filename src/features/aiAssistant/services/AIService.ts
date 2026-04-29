import type { ChatMessage } from "../models/ChatMessage";
import { HttpClient } from "@/core/network/HttpClient";
import { CHAT_URL } from "@/core/config/endpoints";

type ChatResponse = {
  reply: string;
};

export class AIService {
  private readonly api = HttpClient.getInstance().client;

  public async sendMessage(message: string, history: ChatMessage[], signal?: AbortSignal): Promise<string> {
    const config = signal ? { signal } : undefined;
    const response = await this.api.post<ChatResponse>(CHAT_URL, { message, history }, config);

    if (!response.data.reply) {
      throw new Error("INVALID_CHAT_RESPONSE");
    }

    return response.data.reply;
  }
}
