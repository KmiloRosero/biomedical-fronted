import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/Button";
import { Surface } from "@/shared/ui/Surface";
import { useAiAssistantStore } from "../stores/useAiAssistantStore";

export function AiAssistantWidget() {
  const isOpen = useAiAssistantStore((s) => s.isOpen);
  const isTyping = useAiAssistantStore((s) => s.isTyping);
  const history = useAiAssistantStore((s) => s.history);
  const historyVersion = useAiAssistantStore((s) => s.historyVersion);
  const open = useAiAssistantStore((s) => s.open);
  const close = useAiAssistantStore((s) => s.close);
  const sendUserMessage = useAiAssistantStore((s) => s.sendUserMessage);

  const messages = useMemo(() => history.toArray(), [history, historyVersion]);

  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping]);

  async function handleSend() {
    const value = draft;
    setDraft("");
    await sendUserMessage(value);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-[min(420px,calc(100vw-40px))]"
          >
            <Surface className="flex h-[min(620px,calc(100vh-120px))] flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-3 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/15 text-emerald-100">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Asistente IA</div>
                    <div className="text-xs text-slate-700 dark:text-white/60">Soporte para el sistema</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-xl p-2 hover:bg-slate-900/5 dark:hover:bg-white/10"
                  aria-label="Cerrar"
                  onClick={close}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-4">
                {messages.length === 0 ? (
                  <div className="mx-auto max-w-[320px] text-center text-sm text-slate-700 dark:text-white/70">
                    <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-slate-900/5 dark:bg-white/5">
                      <Sparkles className="h-6 w-6 text-emerald-200" />
                    </div>
                    Escribe una pregunta para comenzar.
                  </div>
                ) : null}

                <div className="space-y-2">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={cn(
                        "flex",
                        m.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed",
                          m.role === "user"
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-900/5 text-slate-900 dark:bg-white/10 dark:text-white"
                        )}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}

                  {isTyping ? (
                    <div className="flex justify-start">
                      <div className="rounded-2xl bg-slate-900/5 px-4 py-2 text-sm text-slate-700 dark:bg-white/10 dark:text-white/80">
                        Escribiendo...
                      </div>
                    </div>
                  ) : null}
                  <div ref={bottomRef} />
                </div>
              </div>

              <div className="border-t border-slate-200/70 p-3 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 rounded-xl border border-slate-300/80 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-400/20 dark:border-white/15 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void handleSend();
                      }
                    }}
                    disabled={isTyping}
                  />
                  <Button
                    type="button"
                    onClick={handleSend}
                    disabled={isTyping || !draft.trim()}
                    aria-label="Enviar"
                  >
                    <Send className="h-4 w-4" />
                    Enviar
                  </Button>
                </div>
              </div>
            </Surface>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!isOpen ? (
        <button
          type="button"
          onClick={open}
          className="group grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-500"
          aria-label="Abrir asistente"
        >
          <Bot className="h-6 w-6 transition group-hover:scale-105" />
        </button>
      ) : null}
    </div>
  );
}
