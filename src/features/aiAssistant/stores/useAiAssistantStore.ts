import { create } from "zustand";
import { LinkedList } from "@/core/structures";
import type { ChatMessage } from "../models/ChatMessage";
import { AIService } from "../services/AIService";

type AiAssistantState = {
  isOpen: boolean;
  isTyping: boolean;
  error: string | null;
  history: LinkedList<ChatMessage>;
  historyVersion: number;
  open: () => void;
  close: () => void;
  toggle: () => void;
  clearError: () => void;
  sendUserMessage: (content: string) => Promise<void>;
};

const aiService = new AIService();

export const useAiAssistantStore = create<AiAssistantState>((set, get) => ({
  isOpen: false,
  isTyping: false,
  error: null,
  history: new LinkedList<ChatMessage>((a, b) => a.id === b.id),
  historyVersion: 0,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  clearError: () => set({ error: null }),
  sendUserMessage: async (content) => {
    const trimmed = content.trim();
    if (!trimmed) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      createdAt: Date.now(),
    };

    const state = get();
    state.history.append(userMessage);
    set({ historyVersion: state.historyVersion + 1, isTyping: true, error: null });

    try {
      const historyArray = state.history.toArray();
      const replyText = await aiService.sendMessage(trimmed, historyArray);
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: replyText,
        createdAt: Date.now(),
      };
      state.history.append(assistantMessage);
      set({ historyVersion: get().historyVersion + 1, isTyping: false });
    } catch {
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "No pude conectarme al servidor. Intenta de nuevo.",
        createdAt: Date.now(),
      };
      state.history.append(assistantMessage);
      set({
        historyVersion: get().historyVersion + 1,
        isTyping: false,
        error: "Error al contactar el servicio.",
      });
    }
  },
}));
