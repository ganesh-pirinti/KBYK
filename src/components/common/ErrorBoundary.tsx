import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle, Home } from 'lucide-react';

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
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('KBYK ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '';
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FCFAF9] flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-[#F7E6EB] space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F7E6EB] flex items-center justify-center text-[#145C45]">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#77716F]">
                KBYK Atelier Safeguard
              </span>
              <h1 className="font-serif text-2xl font-bold text-[#292626] mt-2">
                A Gentle Interruption
              </h1>
              <p className="text-xs text-[#77716F] mt-2 leading-relaxed">
                Something unexpected happened while crafting this page. Your cart items and saved wishlist are safe in your local browser.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-[#FCFAF9] border border-[#F7E6EB] rounded-xl text-left">
                <span className="text-[10px] font-mono text-gray-500 block">Debug Details:</span>
                <p className="text-xs font-mono text-rose-700 mt-1 truncate">
                  {this.state.error.message || 'Unknown application error'}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 py-3 px-4 rounded-xl bg-[#145C45] hover:bg-[#196B51] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                Reload Studio
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.hash = '';
                }}
                className="py-3 px-4 rounded-xl bg-[#F7E6EB] hover:bg-[#F2D7E0] text-[#145C45] text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Home className="w-4 h-4" />
                Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
