import type { ReactNode } from "react";
import type { ChatMessage } from "./ChatPanel";

interface MessageBubbleProps {
  message: ChatMessage;
}

/** Renders inline markdown: **bold**, *italic*, `code` */
function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    if (match[2]) {
      parts.push(<strong key={key++} className="font-semibold text-text-primary">{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<em key={key++}>{match[3]}</em>);
    } else if (match[4]) {
      parts.push(
        <code key={key++} className="rounded bg-bg-primary/60 border border-border px-1 py-0.5 font-mono text-xs text-accent">
          {match[4]}
        </code>
      );
    }
    last = match.index + match[0].length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

/** Renders markdown content: code blocks, paragraphs with inline formatting */
function renderMarkdown(content: string): ReactNode {
  const segments = content.split(/(```[\s\S]*?```)/g);
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.startsWith("```") && seg.endsWith("```")) {
          const inner = seg.slice(3, -3).replace(/^\w*\n/, "");
          return (
            <pre key={i} className="my-2 rounded-lg bg-bg-primary/50 border border-border p-3 font-mono text-xs overflow-x-auto whitespace-pre">
              <code>{inner}</code>
            </pre>
          );
        }
        // Split into paragraphs
        return seg.split(/\n\n+/).map((para, j) => {
          const trimmed = para.trim();
          if (!trimmed) return null;
          return (
            <p key={`${i}-${j}`} className="mb-2 last:mb-0 whitespace-pre-wrap break-words">
              {renderInline(trimmed)}
            </p>
          );
        });
      })}
    </>
  );
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <span className="font-mono text-xs text-text-muted italic px-4 py-1">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed
          ${
            isUser
              ? "bg-indigo/10 border border-indigo/20 text-text-primary"
              : "bg-bg-elevated border border-border text-text-primary"
          }
        `}
      >
        {/* Role label */}
        <p
          className={`font-mono text-[10px] uppercase tracking-wider mb-1.5 ${
            isUser ? "text-indigo" : "text-accent"
          }`}
        >
          {isUser ? "Tu" : "Intervistatore"}
        </p>

        {/* Markdown content */}
        <div>{renderMarkdown(message.content)}</div>
      </div>
    </div>
  );
}
