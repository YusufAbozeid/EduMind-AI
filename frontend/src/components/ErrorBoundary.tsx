import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Production ErrorBoundary caught runtime exception:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetState = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div 
          className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-white text-center font-sans"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-5 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold text-white">
                SHAGHOOF AI Platform Recovery
              </h2>
              <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">
                بروتوكول التعافي الآمن للواجهة
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-medium bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 text-start">
              <p>
                حدث خطأ غير متوقع في عرض الواجهة. تم تفعيل بروتوكول الحماية للحفاظ على سلامة النظام.
              </p>
              <p className="text-slate-400 text-[11px]">
                An unexpected UI exception occurred. Safe recovery protocol activated.
              </p>
              {this.state.error && (
                <div className="mt-3 p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 font-mono text-[11px] overflow-x-auto">
                  <div className="font-bold text-rose-400">{this.state.error.name}: {this.state.error.message}</div>
                  {this.state.error.stack && (
                    <pre className="mt-1 text-[10px] text-rose-400/70 whitespace-pre-wrap max-h-32 overflow-y-auto">
                      {this.state.error.stack.split('\n').slice(0, 4).join('\n')}
                    </pre>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                aria-label="Reload application"
                className="w-full py-3 rounded-xl bg-[#FF4D2D] hover:bg-[#E03E1C] text-white text-xs font-bold hover:scale-[1.01] transition flex items-center justify-center gap-2 shadow-md shadow-[#FF4D2D]/20"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة تحميل التطبيق (Reload Application)</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetState}
                aria-label="Reset application cache and reload"
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/50 border border-slate-700 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 text-xs font-semibold transition flex items-center justify-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>إعادة ضبط الذاكرة المؤقتة (Clear Cache & Reset)</span>
              </button>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
