export type AnalyzerResponse = {
  title?: string;
  description?: string;
  report?: string;
  recommendations?: string[];
  extracted?: unknown;
} & Record<string, unknown>;

