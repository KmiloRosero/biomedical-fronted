import { useEffect, useMemo, useState } from "react";
import { FileDown, Copy, XCircle, Sparkles, History, Image as ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/shared/ui/Button";
import { Surface } from "@/shared/ui/Surface";
import { JsonViewer } from "@/shared/ui/JsonViewer";
import { CodeBlock } from "@/shared/ui/CodeBlock";
import { cn } from "@/lib/utils";
import type { AnalyzerAnalysisType } from "../models/AnalyzerAnalysisType";
import type { AnalyzerResponse } from "../models/AnalyzerResponse";
import { useAnalyzerStore } from "../stores/useAnalyzerStore";

type AnalysisOption = { value: AnalyzerAnalysisType; label: string; helper: string };

const analysisOptions: AnalysisOption[] = [
  { value: "route", label: "Ruta", helper: "Describe una ruta, puntos, tiempos, incidentes y hallazgos." },
  { value: "traceability", label: "Trazabilidad", helper: "Analiza eventos, hitos, estados y cadena de custodia." },
  { value: "waste", label: "Residuos", helper: "Identifica tipos, cantidades, riesgos y recomendaciones de manejo." },
  { value: "report", label: "Reporte", helper: "Resume un informe y genera conclusiones/acciones sugeridas." },
  { value: "municipality", label: "Municipio", helper: "Extrae contexto territorial y necesidades operativas." },
  { value: "fleet", label: "Flota", helper: "Interpreta información de vehículos, capacidad, mantenimiento y uso." },
  { value: "other", label: "Otro", helper: "Análisis general cuando el contenido no encaja en categorías." },
];

export function AnalyzerPage() {
  const [analysisType, setAnalysisType] = useState<AnalyzerAnalysisType>("route");
  const [text, setText] = useState("");
  const [context, setContext] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const isLoading = useAnalyzerStore((s) => s.isLoading);
  const error = useAnalyzerStore((s) => s.error);
  const errorDetails = useAnalyzerStore((s) => s.errorDetails);
  const result = useAnalyzerStore((s) => s.result);
  const runs = useAnalyzerStore((s) => s.runs);
  const analyze = useAnalyzerStore((s) => s.analyze);
  const cancel = useAnalyzerStore((s) => s.cancel);
  const clear = useAnalyzerStore((s) => s.clear);
  const selectRun = useAnalyzerStore((s) => s.selectRun);
  const clearError = useAnalyzerStore((s) => s.clearError);

  const selectedOption = useMemo(
    () => analysisOptions.find((o) => o.value === analysisType) ?? analysisOptions[0]!,
    [analysisType]
  );

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  async function handleAnalyze() {
    clearError();
    const request = {
      analysisType,
      text,
      context,
      ...(imageFile ? { imageFile } : {}),
    };
    await analyze(request);
  }

  function handleReset() {
    setText("");
    setContext("");
    setImageFile(null);
    clear();
  }

  function handleDownloadJson() {
    if (!result) return;
    downloadAsFile(
      `analisis-${analysisType}-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(result, null, 2),
      "application/json"
    );
    toast.success("JSON descargado");
  }

  async function handleCopyReport() {
    const relevance = deriveRelevance(result);
    const textToCopy =
      relevance.status === "unrelated"
        ? relevance.message
        : extractPrimaryReportText(result);

    if (!textToCopy) {
      toast.error("No hay texto para copiar");
      return;
    }
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Reporte copiado");
    } catch {
      toast.error("No se pudo copiar");
    }
  }

  const canAnalyze = Boolean(text.trim()) || Boolean(imageFile);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-xl font-semibold">Analizador con IA</h2>
          <p className="mt-1 text-sm text-slate-700 dark:text-white/70">
            Carga texto o una imagen (ruta, trazabilidad, residuo, reporte, municipio, flota) y genera una descripción y
            un reporte estructurado.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Button type="button" variant="secondary" onClick={cancel}>
              <XCircle className="h-4 w-4" />
              Cancelar
            </Button>
          ) : null}
          <Button type="button" variant="secondary" onClick={handleReset} disabled={isLoading && !result}>
            Limpiar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Surface className="p-4 sm:p-6 lg:col-span-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <div className="text-base font-semibold">Entrada</div>
              <div className="mt-1 text-sm text-slate-700 dark:text-white/60">{selectedOption.helper}</div>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200/70 bg-slate-900/5 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/80">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm text-slate-700 dark:text-white/80">Tipo de análisis</span>
              <select
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value as AnalyzerAnalysisType)}
                className={cn(
                  "w-full rounded-xl border border-slate-300/80 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-400/20 dark:border-white/15 dark:bg-white/10 dark:text-white",
                  isLoading ? "opacity-70" : null
                )}
                disabled={isLoading}
              >
                {analysisOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm text-slate-700 dark:text-white/80">Texto (opcional)</span>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className={cn(
                  "h-40 w-full resize-none rounded-xl border border-slate-300/80 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-400/20 dark:border-white/15 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40",
                  isLoading ? "opacity-70" : null
                )}
                placeholder="Pega aquí datos, descripción, observaciones, tablas o cualquier texto relevante."
                disabled={isLoading}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm text-slate-700 dark:text-white/80">Contexto adicional (opcional)</span>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className={cn(
                  "h-24 w-full resize-none rounded-xl border border-slate-300/80 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-400/20 dark:border-white/15 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40",
                  isLoading ? "opacity-70" : null
                )}
                placeholder="Ej: municipio, fecha, responsable, placa, turno, observaciones operativas."
                disabled={isLoading}
              />
            </label>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm text-slate-700 dark:text-white/80">Imagen (opcional)</div>
                {imageFile ? (
                  <button
                    type="button"
                    className="text-xs text-rose-600 hover:underline dark:text-rose-200"
                    onClick={() => setImageFile(null)}
                    disabled={isLoading}
                  >
                    Quitar
                  </button>
                ) : null}
              </div>
              <label
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dashed border-slate-300/80 bg-white/60 px-4 py-3 text-sm text-slate-700 transition hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10",
                  isLoading ? "pointer-events-none opacity-70" : null
                )}
              >
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  <span>{imageFile ? imageFile.name : "Seleccionar imagen"}</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  disabled={isLoading}
                />
              </label>

              {imagePreviewUrl ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200/70 dark:border-white/10">
                  <img src={imagePreviewUrl} alt="Vista previa" className="h-48 w-full object-cover" />
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" onClick={() => void handleAnalyze()} isLoading={isLoading} disabled={!canAnalyze}>
                Analizar
              </Button>
              {error ? (
                <div className="text-sm text-rose-600 dark:text-rose-200">
                  {error}
                  {errorDetails ? (
                    <div className="mt-2">
                      <CodeBlock className="text-[11px]">{errorDetails}</CodeBlock>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </Surface>

        <div className="space-y-4 lg:col-span-7">
          <Surface className="p-4 sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold">Resultado</div>
                <div className="mt-1 text-sm text-slate-700 dark:text-white/60">
                  El backend debe devolver un objeto con la descripción y el reporte (idealmente estructurado).
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="secondary" onClick={handleCopyReport} disabled={!result}>
                  <Copy className="h-4 w-4" />
                  Copiar
                </Button>
                <Button type="button" variant="secondary" onClick={handleDownloadJson} disabled={!result}>
                  <FileDown className="h-4 w-4" />
                  Descargar
                </Button>
              </div>
            </div>

            {result ? (
              <div className="space-y-3">
                {deriveRelevance(result).status === "unrelated" ? (
                  <div>
                    <div className="mb-2 text-sm font-medium">Validación</div>
                    <CodeBlock className="border border-rose-200/60 bg-rose-50 text-sm leading-relaxed text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100 whitespace-pre-wrap">
                      {deriveRelevance(result).message}
                    </CodeBlock>
                    {deriveRelevance(result).details ? (
                      <div className="mt-2 text-xs text-slate-700 dark:text-white/60 whitespace-pre-wrap">
                        {deriveRelevance(result).details}
                      </div>
                    ) : null}
                  </div>
                ) : extractPrimaryReportText(result) ? (
                  <div>
                    <div className="mb-2 text-sm font-medium">Reporte</div>
                    <CodeBlock className="text-sm leading-relaxed whitespace-pre-wrap">
                      {extractPrimaryReportText(result)}
                    </CodeBlock>
                  </div>
                ) : null}
                <div>
                  <div className="mb-2 text-sm font-medium">Respuesta completa (JSON)</div>
                  <JsonViewer value={result} />
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-700 dark:text-white/60">
                Aún no hay resultados. Carga un texto o imagen y ejecuta el análisis.
              </div>
            )}
          </Surface>

          {runs.length ? (
            <Surface className="p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-base font-semibold">
                  <History className="h-5 w-5" />
                  Historial
                </div>
                <div className="text-xs text-slate-600 dark:text-white/50">Últimos {runs.length}</div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {runs.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className="rounded-2xl border border-slate-200/70 bg-white/60 p-3 text-left text-sm transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                    onClick={() => selectRun(r.id)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium">{analysisOptions.find((o) => o.value === r.analysisType)?.label}</div>
                      <div className="text-xs text-slate-600 dark:text-white/50">
                        {new Date(r.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-1 line-clamp-2 text-xs text-slate-700 dark:text-white/60">
                      {r.textPreview ?? r.imageName ?? "Sin detalle"}
                    </div>
                  </button>
                ))}
              </div>
            </Surface>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function extractPrimaryReportText(value: AnalyzerResponse | null): string | null {
  if (!value) return null;
  if (deriveRelevance(value).status === "unrelated") return null;
  const raw = value as Record<string, unknown>;
  const candidates = [
    value.report,
    value.description,
    raw["summary"],
    raw["reply"],
    raw["text"],
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c.trim();
  }
  return null;
}

function deriveRelevance(
  value: AnalyzerResponse | null
): { status: "related" | "unrelated" | "unknown"; message: string | null; details: string | null } {
  if (!value) return { status: "unknown", message: null, details: null };
  const raw = value as Record<string, unknown>;

  const explicit =
    value.isRelevant ??
    (typeof raw["isRelevant"] === "boolean" ? (raw["isRelevant"] as boolean) : undefined) ??
    (typeof raw["relatedToProject"] === "boolean" ? (raw["relatedToProject"] as boolean) : undefined) ??
    (typeof raw["projectRelated"] === "boolean" ? (raw["projectRelated"] as boolean) : undefined) ??
    (typeof raw["isRelated"] === "boolean" ? (raw["isRelated"] as boolean) : undefined) ??
    (typeof raw["domainMatch"] === "boolean" ? (raw["domainMatch"] as boolean) : undefined);

  if (explicit === true) {
    return { status: "related", message: null, details: null };
  }

  const score =
    value.relevanceScore ??
    (typeof raw["relevanceScore"] === "number" ? (raw["relevanceScore"] as number) : undefined) ??
    (typeof raw["confidence"] === "number" ? (raw["confidence"] as number) : undefined) ??
    (typeof raw["similarity"] === "number" ? (raw["similarity"] as number) : undefined);

  const reason =
    value.relevanceReason ??
    (typeof raw["relevanceReason"] === "string" ? (raw["relevanceReason"] as string) : undefined) ??
    (typeof raw["reason"] === "string" ? (raw["reason"] as string) : undefined) ??
    (typeof raw["message"] === "string" ? (raw["message"] as string) : undefined);

  if (explicit === false || (typeof score === "number" && score >= 0 && score < 0.35)) {
    const message = "La imagen no tiene relación con el proyecto.";
    const details = reason?.trim() ? `Motivo: ${reason.trim()}` : null;
    return { status: "unrelated", message, details };
  }

  return { status: "unknown", message: null, details: null };
}

function downloadAsFile(fileName: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
