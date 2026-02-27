import type { ChatMessage } from "./ChatPanel";

interface MessageBubbleProps {
  message: ChatMessage;
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

        {/* Content with basic markdown-like formatting */}
        <div className="whitespace-pre-wrap break-words">
          {message.content.split("```").map((block, i) => {
            if (i % 2 === 1) {
              // Code block
              return (
                <pre
                  key={i}
                  className="my-2 rounded-lg bg-bg-primary/50 border border-border p-3 font-mono text-xs overflow-x-auto"
                >
                  <code>{block.replace(/^\w+\n/, "")}</code>
                </pre>
              );
            }
            return <span key={i}>{block}</span>;
          })}
        </div>
      </div>
    </div>
  );
}
