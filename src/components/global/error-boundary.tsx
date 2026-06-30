"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RotateCcw } from "lucide-react"

interface Props {
  children?: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught rendering error:", error, errorInfo)
    // In production, log this crash report to the API
    fetch('/api/logs/crash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      })
    }).catch((e) => console.error('Failed to report crash:', e))
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[400px] w-full flex flex-col items-center justify-center p-6 bg-background select-none">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="size-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto text-destructive">
              <AlertTriangle className="size-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-foreground">Something went wrong</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                An unexpected error occurred while rendering this component. The development team has been notified.
              </p>
              {this.state.error && (
                <pre className="p-3 bg-muted rounded-lg text-left text-xs font-mono overflow-x-auto border max-h-[150px] mt-2 opacity-80">
                  {this.state.error.message}
                </pre>
              )}
            </div>
            <Button onClick={this.handleRetry} className="gap-2 mx-auto rounded-xl font-semibold">
              <RotateCcw className="size-4" />
              Reload Page
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
