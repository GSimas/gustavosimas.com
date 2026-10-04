import { Fragment, memo, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, m } from "motion/react";
import { ArrowUp, RotateCcw, Square, X } from "lucide-react";
import type { Language } from "./content";

// Tavo lives beside the pages (mounted once in App), not inside any of them, so
// a reply keeps streaming while the reader moves between routes. The thread is
// kept in sessionStorage so a reload doesn't wipe it.

type Status = "thinking" | "streaming" | "done" | "error" | "stopped";
type Message = { id: string; role: "user" | "assistant"; content: string; at?: number; status?: Status; error?: string };

// Tavo's face: an illustrated nod to Gustavo's portrait (curly hair, mustache
// and goatee, striped shirt over a light tee, warm tapestry behind), drawn
// rather than photographed so the assistant never passes for the man himself.
function TavoFace({ size }: { size: number }) {
  const stripes = useId();
  const skin = "#c0835d";
  const dark = "#24150e";
  return (
    <svg className="tavo-face" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={stripes} width="2.4" height="4" patternUnits="userSpaceOnUse">
          <rect width="2.4" height="4" fill="#e7ebef" />
          <rect width="0.9" height="4" fill="#9fb2c6" />
        </pattern>
      </defs>
      <rect width="64" height="64" fill="#f0a22e" />
      <path d="M0 40 Q18 30 30 6 L0 0Z M64 22 Q50 36 58 64 L64 64Z" fill="#e2701c" opacity="0.55" />
      <rect x="28.3" y="41" width="7.4" height="11" fill="#a86a47" />
      <path d="M19 64 L22 50 Q32 54.5 42 50 L45 64Z" fill="#f2e6cf" />
      <path d="M2 64 Q6 51 22 48.5 L26 64Z M62 64 Q58 51 42 48.5 L38 64Z" fill={`url(#${stripes})`} />
      <path d="M22 48.5 L18.5 55 L26 55.5Z M42 48.5 L45.5 55 L38 55.5Z" fill="#d5dde5" />
      <ellipse cx="20.6" cy="32" rx="2.6" ry="3.6" fill={skin} />
      <ellipse cx="43.4" cy="32" rx="2.6" ry="3.6" fill={skin} />
      <ellipse cx="32" cy="31" rx="12" ry="13.6" fill={skin} />
      <g fill={dark}>
        <circle cx="21.6" cy="21" r="3.9" />
        <circle cx="24" cy="15.5" r="6" />
        <circle cx="31.5" cy="12.5" r="6.6" />
        <circle cx="39" cy="14" r="6" />
        <circle cx="42.6" cy="19.4" r="4.6" />
        <circle cx="27" cy="19.5" r="3.4" />
        <circle cx="34.5" cy="19" r="3.6" />
      </g>
      <g fill="none" stroke={dark} strokeLinecap="round">
        <path d="M24.6 26.6 Q27.6 24.9 30.6 26.3" strokeWidth="1.9" />
        <path d="M33.4 26.3 Q36.4 24.9 39.4 26.6" strokeWidth="1.9" />
        <path d="M30.4 35.4 Q32 36.5 33.6 35.4" stroke="#8a5537" strokeWidth="1.1" />
      </g>
      <ellipse cx="27.6" cy="29.8" rx="1.5" ry="1.3" fill={dark} />
      <ellipse cx="36.4" cy="29.8" rx="1.5" ry="1.3" fill={dark} />
      <path d="M27.4 39.3 Q32 45 36.6 39.3 Q32 40.3 27.4 39.3Z" fill="#fff" />
      <path d="M26.4 39.2 Q29.2 36.9 32 37.8 Q34.8 36.9 37.6 39.2 Q34.8 38.2 32 38.9 Q29.2 38.2 26.4 39.2Z" fill={dark} />
      <ellipse cx="32" cy="45.2" rx="1.8" ry="1.6" fill={dark} />
    </svg>
  );
}

const STORAGE_KEY = "tavo-chat-v1";
const MAX_CHARS = 2000;

const copy = {
  pt: {
    open: "Abrir o Tavo, assistente de IA",
    close: "Fechar o Tavo",
    title: "Tavo",
    badge: "IA",
    subtitle: "Assistente de IA sobre Gustavo Simas",
    disclaimer:
      "Você está conversando com uma inteligência artificial, não com o Gustavo. As respostas são geradas automaticamente (modelo DeepSeek) a partir do conteúdo público deste site e podem conter erros. Não compartilhe dados pessoais ou sensíveis. Para confirmar qualquer informação:",
    placeholder: "Pergunte sobre o Gustavo, o currículo, os projetos…",
    send: "Enviar",
    stop: "Parar resposta",
    clear: "Nova conversa",
    thinking: "Tavo está pensando",
    aiLabel: "Tavo · resposta gerada por IA",
    you: "Você",
    stopped: "Resposta interrompida.",
    intro: "Oi! Eu sou o Tavo, uma IA treinada (bem, instruída) com o que está publicado neste site. Posso contar sobre a trajetória do Gustavo, as pesquisas, os livros, as criações e como falar com ele.",
    suggestions: ["Quem é o Gustavo Simas?", "Quais livros ele publicou?", "O que ele pesquisa no doutorado?", "Como entrar em contato?"],
    errors: {
      429: "Muitas perguntas em pouco tempo. Espere um minuto e tente de novo.",
      503: "O Tavo ainda não foi configurado neste ambiente.",
      blocked: "Essa resposta foi bloqueada pelos filtros de segurança.",
      timeout: "A resposta demorou demais. Tente uma pergunta mais curta.",
      default: "Não consegui responder agora. Tente de novo em instantes.",
    },
  },
  en: {
    open: "Open Tavo, the AI assistant",
    close: "Close Tavo",
    title: "Tavo",
    badge: "AI",
    subtitle: "AI assistant about Gustavo Simas",
    disclaimer:
      "You are talking to an artificial intelligence, not to Gustavo. Answers are generated automatically (DeepSeek model) from this site's public content and may contain mistakes. Do not share personal or sensitive data. To confirm any information:",
    placeholder: "Ask about Gustavo, his CV, his projects…",
    send: "Send",
    stop: "Stop answer",
    clear: "New conversation",
    thinking: "Tavo is thinking",
    aiLabel: "Tavo · AI-generated answer",
    you: "You",
    stopped: "Answer interrupted.",
    intro: "Hi! I'm Tavo, an AI instructed with what is published on this site. I can tell you about Gustavo's path, research, books, creations and how to reach him.",
    suggestions: ["Who is Gustavo Simas?", "Which books has he published?", "What is his PhD research about?", "How can I contact him?"],
    errors: {
      429: "Too many questions in a short time. Wait a minute and try again.",
      503: "Tavo is not configured in this environment yet.",
      blocked: "This answer was blocked by the safety filters.",
      timeout: "The answer took too long. Try a shorter question.",
      default: "I couldn't answer right now. Please try again shortly.",
    },
  },
};

function loadThread(): Message[] {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "[]") as Message[];
    // A reply that was mid-flight when the page reloaded can't be resumed.
    return saved.map((m) => (m.status === "thinking" || m.status === "streaming" ? { ...m, status: "stopped" } : m));
  } catch {
    return [];
  }
}

const id = () => Math.random().toString(36).slice(2);

// "14:32", or "03/10 14:32" once the message is from another day.
function stamp(at: number, language: Language) {
  const date = new Date(at);
  const locale = language === "pt" ? "pt-BR" : "en";
  const time = date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  return date.toDateString() === new Date().toDateString()
    ? time
    : `${date.toLocaleDateString(locale, { day: "2-digit", month: "2-digit" })} ${time}`;
}

export function Tavo({ language, navigate }: { language: Language; navigate: (path: string) => void }) {
  const t = copy[language];
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadThread);
  const [draft, setDraft] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const savedAt = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const busy = messages.some((m) => m.status === "thinking" || m.status === "streaming");

  useEffect(() => {
    // While streaming, save at most once a second instead of on every token.
    if (busy && Date.now() - savedAt.current < 1000) return;
    savedAt.current = Date.now();
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Storage full or blocked: the thread just won't survive a reload.
    }
  }, [messages, busy]);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    // Closing hands focus back to the button that opened the panel.
    if (!open) {
      if (wasOpen.current) fabRef.current?.focus();
      return;
    }
    wasOpen.current = true;
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const patch = (messageId: string, change: (m: Message) => Partial<Message>) =>
    setMessages((all) => all.map((m) => (m.id === messageId ? { ...m, ...change(m) } : m)));

  const send = async (text: string) => {
    const question = text.trim().slice(0, MAX_CHARS);
    if (!question || busy) return;
    const history = messages
      .filter((m) => m.content && (m.role === "user" || m.status === "done"))
      .map(({ role, content }) => ({ role, content }));
    const answerId = id();
    const at = Date.now();
    setMessages((all) => [...all, { id: id(), role: "user", content: question, at }, { id: answerId, role: "assistant", content: "", at, status: "thinking" }]);
    setDraft("");
    setAnnouncement(t.thinking);

    const controller = new AbortController();
    abortRef.current = controller;
    const fail = (key: keyof typeof t.errors) => patch(answerId, () => ({ status: "error", error: String(key) }));

    try {
      const response = await fetch("/api/tavo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: [...history, { role: "user", content: question }], page: window.location.pathname.replace(/\/$/, "") || "/" }),
        signal: controller.signal,
      });
      if (!response.ok || !response.body) {
        fail(response.status === 429 ? 429 : response.status === 503 ? 503 : "default");
        return;
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finished = false;
      let full = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as { type: string; text?: string; message?: string };
          if (event.type === "delta" && event.text) {
            const piece = event.text;
            full += piece;
            patch(answerId, (m) => ({ content: m.content + piece, status: "streaming" }));
          } else if (event.type === "done") {
            finished = true;
            patch(answerId, () => ({ status: "done", at: Date.now() }));
          } else if (event.type === "error") {
            finished = true;
            fail(event.message === "blocked" ? "blocked" : event.message === "timeout" ? "timeout" : "default");
          }
        }
      }
      if (!finished) fail("default");
      // Screen readers get the finished answer once, as plain text, rather
      // than a live region chattering through every streamed fragment.
      else setAnnouncement(`${t.aiLabel}: ${full.replace(/\*\*|\*|\[([^\]]+)\]\([^)]*\)/g, "$1")}`);
    } catch {
      if (controller.signal.aborted) patch(answerId, () => ({ status: "stopped" }));
      else fail("default");
    } finally {
      abortRef.current = null;
    }
  };

  const clear = () => {
    abortRef.current?.abort();
    setMessages([]);
    inputRef.current?.focus();
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <m.section
            id="tavo-panel"
            className="tavo-panel"
            role="dialog"
            aria-label={`${t.title} — ${t.subtitle}`}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22 }}
          >
            <header className="tavo-head">
              <span className="tavo-avatar" aria-hidden="true"><TavoFace size={34} /></span>
              <div>
                <strong>{t.title} <span className="tavo-badge">{t.badge}</span></strong>
                <small>{t.subtitle}</small>
              </div>
              <button className="tavo-icon" onClick={clear} aria-label={t.clear} title={t.clear}><RotateCcw size={16} /></button>
              <button className="tavo-icon" onClick={() => setOpen(false)} aria-label={t.close} title={t.close}><X size={18} /></button>
            </header>

            <div className="tavo-thread" ref={listRef}>
              {/* Opens every conversation and scrolls away with it. */}
              <p className="tavo-disclaimer" role="note">
                {t.disclaimer} <a href="mailto:contato@gustavosimas.com">contato@gustavosimas.com</a>.
              </p>
              {messages.length === 0 && (
                <div className="tavo-empty">
                  <p>{t.intro}</p>
                  <div className="tavo-suggestions">
                    {t.suggestions.map((s) => <button key={s} onClick={() => send(s)}>{s}</button>)}
                  </div>
                </div>
              )}
              {messages.map((m) => (
                <MessageItem key={m.id} message={m} language={language} navigate={navigate} />
              ))}
            </div>

            <form
              className="tavo-form"
              onSubmit={(event) => {
                event.preventDefault();
                send(draft);
              }}
            >
              <textarea
                ref={inputRef}
                value={draft}
                maxLength={MAX_CHARS}
                rows={1}
                placeholder={t.placeholder}
                aria-label={t.placeholder}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    send(draft);
                  }
                }}
              />
              {busy ? (
                <button type="button" className="tavo-send" onClick={() => abortRef.current?.abort()} aria-label={t.stop} title={t.stop}><Square size={14} /></button>
              ) : (
                <button type="submit" className="tavo-send" disabled={!draft.trim()} aria-label={t.send} title={t.send}><ArrowUp size={18} /></button>
              )}
            </form>
          </m.section>
        )}
      </AnimatePresence>

      <button
        ref={fabRef}
        className={`tavo-fab${busy ? " busy" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? t.close : t.open}
        aria-expanded={open}
        aria-controls="tavo-panel"
      >
        {open ? <X size={22} /> : <TavoFace size={34} />}
        <span>{t.title}</span>
        <span className="tavo-badge">{t.badge}</span>
      </button>

      <span className="visually-hidden" aria-live="polite">{announcement}</span>
    </>
  );
}

// One row per message, memoised: while a reply streams only that row
// re-renders, not every earlier answer's markdown.
const MessageItem = memo(function MessageItem({ message: m, language, navigate }: { message: Message; language: Language; navigate: (path: string) => void }) {
  const t = copy[language];
  return (
    <article className={`tavo-msg ${m.role}`}>
      <span className="tavo-msg-label">
        {m.role === "user" ? t.you : t.aiLabel}
        {m.at && <time dateTime={new Date(m.at).toISOString()}> · {stamp(m.at, language)}</time>}
      </span>
      {m.status === "thinking" ? (
        <span className="tavo-thinking">{t.thinking}<i /><i /><i /></span>
      ) : m.role === "user" ? (
        <p>{m.content}</p>
      ) : (
        <div className="tavo-md">{renderMarkdown(m.content, navigate)}</div>
      )}
      {m.status === "streaming" && <span className="tavo-caret" aria-hidden="true" />}
      {m.status === "stopped" && <em className="tavo-note">{t.stopped}</em>}
      {m.status === "error" && <em className="tavo-note error">{t.errors[m.error as keyof typeof t.errors] ?? t.errors.default}</em>}
    </article>
  );
});

// A deliberately small markdown subset (paragraphs, lists, bold, italic, links)
// rendered as React nodes, never as HTML: model output can't inject markup.
function renderMarkdown(text: string, navigate: (path: string) => void): ReactNode {
  return text.split(/\n{2,}/).map((block, index) => {
    const lines = block.split("\n").filter((line) => line.trim());
    if (lines.length && lines.every((line) => /^\s*([-*•]|\d+[.)])\s+/.test(line))) {
      const ordered = /^\s*\d/.test(lines[0]);
      const items = lines.map((line, i) => <li key={i}>{inline(line.replace(/^\s*([-*•]|\d+[.)])\s+/, ""), navigate)}</li>);
      return ordered ? <ol key={index}>{items}</ol> : <ul key={index}>{items}</ul>;
    }
    return (
      <p key={index}>
        {lines.map((line, i) => (
          <Fragment key={i}>
            {i > 0 && <br />}
            {inline(line.replace(/^#+\s*/, ""), navigate)}
          </Fragment>
        ))}
      </p>
    );
  });
}

function inline(text: string, navigate: (path: string) => void): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)\s]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const [, label, href] = link;
      // Internal routes go through the SPA router, so following one doesn't
      // reload the page and cut off a reply that is still streaming.
      if (/^\/(curriculo|criacoes)?$/.test(href)) {
        return (
          <a key={i} href={href} onClick={(event) => { event.preventDefault(); navigate(href); }}>{label}</a>
        );
      }
      if (/^(https?:\/\/|mailto:)/i.test(href)) {
        return <a key={i} href={href} target="_blank" rel="noopener noreferrer nofollow">{label}</a>;
      }
      return label;
    }
    return part;
  });
}
