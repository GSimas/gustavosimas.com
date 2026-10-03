import { Component, type ErrorInfo, type ReactNode } from "react";

// Contains a crash to the piece that crashed (a poem canvas, a page, the
// assistant) instead of blanking the whole site. "Tentar novamente" remounts
// the piece; pass onRetry to do something heavier, like reloading after a
// lazily loaded page failed to download.
// resetKey clears a caught error when it changes (e.g. the route), without
// remounting the children the way a React `key` would.
type Props = { children: ReactNode; fallback?: ReactNode | null; onRetry?: () => void; label?: string; resetKey?: unknown };

export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidUpdate(previous: Props) {
    if (this.state.failed && previous.resetKey !== this.props.resetKey) this.setState({ failed: false });
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[${this.props.label ?? "boundary"}]`, error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    if (this.props.fallback !== undefined) return this.props.fallback;
    const pt = document.documentElement.lang.startsWith("pt");
    return (
      <div className="error-fallback" role="alert">
        <p>{pt ? "Algo deu errado ao exibir este conteúdo." : "Something went wrong displaying this content."}</p>
        <button
          type="button"
          className="button ghost"
          onClick={() => (this.props.onRetry ? this.props.onRetry() : this.setState({ failed: false }))}
        >
          {pt ? "Tentar novamente" : "Try again"}
        </button>
      </div>
    );
  }
}
