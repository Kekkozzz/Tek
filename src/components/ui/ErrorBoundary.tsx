"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="h-14 w-14 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center mb-4">
              <span className="font-mono text-xl text-danger">!</span>
            </div>
            <h3 className="font-display text-lg font-semibold text-text-primary">
              Qualcosa è andato storto
            </h3>
            <p className="mt-2 max-w-sm text-sm text-text-secondary">
              {this.state.error?.message || "Errore imprevisto"}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="cursor-pointer mt-4 px-4 py-2 rounded-lg bg-bg-elevated border border-border font-mono text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Riprova
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
