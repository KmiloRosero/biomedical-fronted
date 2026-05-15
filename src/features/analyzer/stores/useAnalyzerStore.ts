import { create } from "zustand";
import axios from "axios";
import type { AnalyzerRequest } from "../models/AnalyzerRequest";
import type { AnalyzerResponse } from "../models/AnalyzerResponse";
import { AnalyzerService } from "../services/AnalyzerService";

type AnalyzerRun = {
  id: string;
  createdAt: number;
  analysisType: AnalyzerRequest["analysisType"];
  textPreview: string | null;
  imageName: string | null;
  result: AnalyzerResponse;
};

type AnalyzerState = {
  isLoading: boolean;
  error: string | null;
  errorDetails: string | null;
  result: AnalyzerResponse | null;
  runs: AnalyzerRun[];
  analyze: (request: AnalyzerRequest) => Promise<void>;
  cancel: () => void;
  clear: () => void;
  clearError: () => void;
  selectRun: (id: string) => void;
};

const analyzerService = new AnalyzerService();

export const useAnalyzerStore = create<AnalyzerState>((set, get) => ({
  isLoading: false,
  error: null,
  errorDetails: null,
  result: null,
  runs: [],
  analyze: async (request) => {
    const hasText = Boolean(request.text?.trim());
    const hasImage = Boolean(request.imageFile);
    if (!hasText && !hasImage) {
      set({ error: "Debes cargar texto o una imagen para analizar.", errorDetails: null });
      return;
    }

    get().cancel();
    const abort = new AbortController();
    set({
      isLoading: true,
      error: null,
      errorDetails: null,
      result: null,
      cancel: () => abort.abort(),
    });

    try {
      const data = await analyzerService.analyze(request, abort.signal);
      set({ isLoading: false, result: data });

      const textPreview = request.text?.trim()
        ? request.text.trim().slice(0, 140)
        : null;

      const run: AnalyzerRun = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        analysisType: request.analysisType,
        textPreview,
        imageName: request.imageFile?.name ?? null,
        result: data,
      };

      set((s) => ({
        runs: [run, ...s.runs].slice(0, 12),
      }));
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.code === "ERR_CANCELED") {
        set({ isLoading: false });
        return;
      }
      const mapped = mapAnalyzerErrorToUserMessage(err);
      set({
        isLoading: false,
        error: mapped.userMessage,
        errorDetails: mapped.details,
      });
    } finally {
      set({ cancel: () => {} });
    }
  },
  cancel: () => {},
  clear: () => set({ result: null, error: null, errorDetails: null }),
  clearError: () => set({ error: null, errorDetails: null }),
  selectRun: (id) => {
    const run = get().runs.find((r) => r.id === id);
    if (run) {
      set({ result: run.result, error: null, errorDetails: null });
    }
  },
}));

function mapAnalyzerErrorToUserMessage(error: unknown): { userMessage: string; details: string | null } {
  if (!axios.isAxiosError(error)) {
    return {
      userMessage: "No pude procesar el análisis. Intenta de nuevo.",
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
      userMessage: "El backend no encontró el endpoint del analizador (`/api/analyzer`).",
      details: url ? `HTTP 404 - URL: ${url}` : "HTTP 404",
    };
  }

  if (status === 413) {
    return {
      userMessage: "El archivo es demasiado grande para procesarlo. Intenta con una imagen más liviana.",
      details: url ? `HTTP 413 - URL: ${url}` : "HTTP 413",
    };
  }

  if (status === 401 || status === 403) {
    return {
      userMessage: "No autorizado para usar el analizador. Inicia sesión nuevamente.",
      details: url ? `HTTP ${status} - URL: ${url}` : `HTTP ${status}`,
    };
  }

  return {
    userMessage: "No pude generar el reporte. Intenta de nuevo.",
    details: url ? `HTTP ${status} - URL: ${url}` : `HTTP ${status}`,
  };
}
