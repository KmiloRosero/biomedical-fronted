import type { AnalyzerAnalysisType } from "./AnalyzerAnalysisType";

export type AnalyzerRequest = {
  analysisType: AnalyzerAnalysisType;
  text?: string;
  context?: string;
  imageFile?: File;
};

