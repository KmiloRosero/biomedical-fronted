import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import toast from "react-hot-toast";
import { getApiBaseUrl } from "@/core/config/env";
import { AdminKeyProvider } from "@/core/auth/AdminKeyProvider";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

type ErrorPayload = {
  message?: string;
  error?: string;
};

export class HttpClient {
  private static instance: HttpClient | null = null;

  private readonly axios: AxiosInstance;
  private readonly adminKeyProvider: AdminKeyProvider;
  private onAuthFailure: (() => void) | null = null;

  private constructor() {
    this.adminKeyProvider = new AdminKeyProvider();

    this.axios = axios.create({
      baseURL: getApiBaseUrl(),
      timeout: 15000,
    });

    this.registerInterceptors();
  }

  public static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  public get client(): AxiosInstance {
    return this.axios;
  }

  public configureAuthFailureHandler(handler: () => void): void {
    this.onAuthFailure = handler;
  }

  public getAdminKey(): string | null {
    return this.adminKeyProvider.get();
  }

  public setAdminKey(value: string | null): void {
    const trimmed = value?.trim();
    if (trimmed) {
      this.adminKeyProvider.set(trimmed);
      return;
    }
    this.adminKeyProvider.clear();
  }

  private registerInterceptors(): void {
    this.axios.interceptors.request.use((config) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      const url = config.url ?? "";
      const isAdminEndpoint = url.startsWith("/api/admin/") || url.includes("/api/admin/");
      if (isAdminEndpoint) {
        const adminKey = this.adminKeyProvider.get();
        if (adminKey) {
          config.headers = config.headers ?? {};
          config.headers["X-Admin-Key"] = adminKey;
        }
      }

      return config;
    });

    this.axios.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          useAuthStore.getState().signOut();
          this.onAuthFailure?.();
          return Promise.reject(error);
        }

        if (status === 409) {
          const message = this.extractMessage(error) ?? "Conflicto de datos. Verifica la información.";
          toast.error(message);
          return Promise.reject(error);
        }

        if (status === 404) {
          const message = this.extractMessage(error) ?? "Recurso no encontrado.";
          toast(message, { icon: "⚠️" });
          return Promise.reject(error);
        }

        return Promise.reject(error);
      }
    );
  }

  private extractMessage(error: AxiosError): string | undefined {
    const data = error.response?.data as ErrorPayload | undefined;
    return data?.message ?? data?.error;
  }
}
