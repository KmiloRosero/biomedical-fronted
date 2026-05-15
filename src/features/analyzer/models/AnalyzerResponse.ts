export type AnalyzerResponse = {
  title?: string;
  description?: string;
  report?: string;
  recommendations?: string[];
  extracted?: unknown;
  isRelevant?: boolean;
  relevanceScore?: number;
  relevanceReason?: string;
} & Record<string, unknown>;
