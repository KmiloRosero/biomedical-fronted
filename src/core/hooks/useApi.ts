import { useMemo } from "react";
import type { AxiosInstance } from "axios";
import { HttpClient } from "@/core/network/HttpClient";

export function useApi(): AxiosInstance {
  return useMemo(() => HttpClient.getInstance().client, []);
}
