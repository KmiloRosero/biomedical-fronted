import { getApiBaseUrl } from "./env";

export const API_BASE_URL = getApiBaseUrl();

export const CHAT_URL = `${API_BASE_URL}/api/chat`;

export const ANALYZER_URL = `${API_BASE_URL}/api/analyzer`;
