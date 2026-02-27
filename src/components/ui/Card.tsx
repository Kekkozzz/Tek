import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glow?: boolean;
  hoverable?: boolean;
}

export default function Card({
  children,
  glow = false,
  hoverable = false,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`
        rounded-xl border border-border bg-bg-secondary p-6
        ${glow ? "glow-border" : ""}
        ${hoverable ? "transition-all duration-300 hover:border-accent/30 hover:bg-bg-elevated hover:-translate-y-0.5" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
