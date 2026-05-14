import { useMemo } from "react";
import { CodeBlock } from "@/shared/ui/CodeBlock";

export function JsonViewer({ value }: { value: unknown }) {
  const text = useMemo(() => {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }, [value]);

  return <CodeBlock>{text}</CodeBlock>;
}
