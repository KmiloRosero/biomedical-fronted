import { HttpClient } from "@/core/network/HttpClient";
import { ANALYZER_URL } from "@/core/config/endpoints";
import type { AnalyzerRequest } from "../models/AnalyzerRequest";
import type { AnalyzerResponse } from "../models/AnalyzerResponse";

export class AnalyzerService {
  private readonly api = HttpClient.getInstance().client;

  public async analyze(request: AnalyzerRequest, signal?: AbortSignal): Promise<AnalyzerResponse> {
    const form = new FormData();
    form.append("analysisType", request.analysisType);

    const text = request.text?.trim();
    if (text) {
      form.append("text", text);
    }

    const context = request.context?.trim();
    if (context) {
      form.append("context", context);
    }

    if (request.imageFile) {
      form.append("image", request.imageFile);
    }

    form.append("language", "es");
    form.append("outputFormat", "json");

    const config = signal ? { signal } : undefined;
    const response = await this.api.post<AnalyzerResponse>(ANALYZER_URL, form, config);
    return response.data;
  }
}

