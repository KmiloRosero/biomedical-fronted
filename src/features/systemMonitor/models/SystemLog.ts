export type SystemLogLevel = "INFO" | "WARNING" | "ERROR" | "CONNECTION";

export interface SystemLog {
  id: string;
  createdAt: number;
  level: SystemLogLevel;
  source: string;
  message: string;
}
