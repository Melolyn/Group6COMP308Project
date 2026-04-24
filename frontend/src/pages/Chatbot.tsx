import { type FormEvent, useMemo, useRef, useState, useEffect } from "react";
import { chatbotService } from "../services/chatbotService";

type ChatMessage = {
  role: "user" | "bot";
  text: string;
};

export default function Chatbot() {
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "Hello, I’m CivicBot. How can I help you today?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = prompt.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setPrompt("");
    setLoading(true);

    try {
      const reply = await chatbotService.sendMessage(trimmed);
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch (err: unknown) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            err instanceof Error
              ? err.message
              : "Sorry, I couldn’t process that request.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const isSendDisabled = useMemo(() => loading || !prompt.trim(), [loading, prompt]);

  return (
    <div className="flex h-full flex-col bg-white text-slate-900">
      <div className="border-b border-slate-200 bg-sky-700 px-4 py-3 text-white">
        <h2 className="text-base font-bold">CivicBot Assistant</h2>
        <p className="mt-1 text-xs text-sky-100">
          Ask questions, report concerns, or get quick help.
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
              message.role === "user"
                ? "ml-auto bg-sky-700 text-white"
                : "bg-slate-100 text-slate-800"
            }`}
          >
            {message.text}
          </div>
        ))}

        {loading && (
          <div className="max-w-[85%] rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-800 shadow-sm">
            CivicBot is preparing a response...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-3">
        <div className="flex items-end gap-2">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your question here..."
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-sky-600 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isSendDisabled}
            className="rounded-xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}