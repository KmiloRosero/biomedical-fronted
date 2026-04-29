import { create } from "zustand";
import { LinkedList } from "@/core/structures";
import type { ChatMessage } from "../models/ChatMessage";
import { AIService } from "../services/AIService";
import axios from "axios";

type AiAssistantState = {
  isOpen: boolean;
  isTyping: boolean;
  error: string | null;
  errorDetails: string | null;
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
  errorDetails: null,
  history: new LinkedList<ChatMessage>((a, b) => a.id === b.id),
  historyVersion: 0,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  clearError: () => set({ error: null, errorDetails: null }),
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
    set({ historyVersion: state.historyVersion + 1, isTyping: true, error: null, errorDetails: null });

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
    } catch (err: unknown) {
      const { userMessage, details } = mapChatErrorToUserMessage(err);
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: userMessage,
        createdAt: Date.now(),
      };
      state.history.append(assistantMessage);
      set({
        historyVersion: get().historyVersion + 1,
        isTyping: false,
        error: "Error al contactar el servicio.",
        errorDetails: details,
      });
    }
  },
}));

function mapChatErrorToUserMessage(error: unknown): { userMessage: string; details: string | null } {
  if (!axios.isAxiosError(error)) {
    return {
      userMessage: "No pude conectarme al servidor. Intenta de nuevo.",
      details: null,
    };
  }

  const status = error.response?.status;
  const url = error.config?.baseURL && error.config?.url ? `${error.config.baseURL}${error.config.url}` : null;

  if (!status) {
    return {
      userMessage:
        "No pude conectarme al servidor. Verifica `VITE_API_BASE_URL` y la configuración CORS del backend.",
      details: url ? `URL: ${url}` : null,
    };
  }

  if (status === 404) {
    return {
      userMessage: "El backend no encontró el endpoint del chat (`/api/chat`).",
      details: url ? `HTTP 404 - URL: ${url}` : "HTTP 404",
    };
  }

  if (status === 401 || status === 403) {
    return {
      userMessage: "No autorizado para usar el chat. Inicia sesión nuevamente.",
      details: url ? `HTTP ${status} - URL: ${url}` : `HTTP ${status}`,
    };
  }

  return {
    userMessage: "No pude procesar tu solicitud de chat. Intenta de nuevo.",
    details: url ? `HTTP ${status} - URL: ${url}` : `HTTP ${status}`,
  };
}
