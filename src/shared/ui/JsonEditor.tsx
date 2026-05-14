import { useMemo, useState } from "react";
import { Button } from "@/shared/ui/Button";
import { CodeBlock } from "@/shared/ui/CodeBlock";

export type JsonEditorProps = {
  initialValue: unknown;
  onSubmit: (value: unknown) => Promise<void>;
  submitLabel: string;
  isSubmitting: boolean;
};

export function JsonEditor({ initialValue, onSubmit, submitLabel, isSubmitting }: JsonEditorProps) {
  const initialText = useMemo(() => JSON.stringify(initialValue ?? {}, null, 2), [initialValue]);
  const [text, setText] = useState(initialText);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    try {
      setError(null);
      const value = JSON.parse(text) as unknown;
      await onSubmit(value);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "JSON inválido";
      setError(msg);
    }
  }

  return (
    <div className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="h-52 w-full rounded-2xl border border-slate-300/80 bg-white p-3 font-mono text-xs text-slate-900 outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-400/20 dark:border-white/15 dark:bg-white/10 dark:text-white"
        spellCheck={false}
      />
      {error ? <CodeBlock className="text-rose-700 dark:text-rose-200">{error}</CodeBlock> : null}
      <div className="flex justify-end">
        <Button type="button" onClick={handleSubmit} isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
