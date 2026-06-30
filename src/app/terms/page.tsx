import type { Metadata } from "next"
import Link from "next/link"
import { Clock, Scale, ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service | Chronos",
  description: "Read the Terms of Service for Chronos. Review the terms governing your use of our local-first productivity workspace.",
  keywords: ["terms of service", "user agreement", "licensing terms", "chronos terms"],
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border/40 bg-background/60 px-6 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
          <div className="size-9 rounded-xl bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/25">
            <Clock className="size-5" />
          </div>
          <span>Chronos</span>
        </Link>
        <Link href="/">
          <span className="text-sm font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="size-4" /> Back to Home
          </span>
        </Link>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 md:py-20 space-y-10">
        <div className="space-y-4 border-b border-border/40 pb-6">
          <h1 className="text-4xl font-black tracking-tight">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last Updated: June 30, 2026</p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Scale className="size-4 text-primary" /> 1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Chronos (the "Application"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not install, access, or use the Application.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">2. License and Scope of Use</h2>
            <p>
              We grant you a personal, non-transferable, non-exclusive, revocable license to use the Application on your personal devices solely for your productivity and task management needs. You agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Reverse engineer, decompile, or disassemble the Application.</li>
              <li>Rent, lease, lend, sell, redistribute, or sublicense the Application.</li>
              <li>Use the Application for any unlawful or unauthorized purpose.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">3. User Data and Ownership</h2>
            <p>
              Chronos operates as a local-first application. <strong>You retain 100% ownership, control, and responsibility</strong> for all data, files, notes, and records that you create, store, or process within the Application. We do not store, back up, or have any access to your local database. It is your sole responsibility to perform regular backups of your local data to prevent loss.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">4. Disclaimer of Warranties</h2>
            <p>
              THE APPLICATION IS PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE APPLICATION WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, OR THAT YOUR LOCAL DATA WILL NEVER BE SUBJECT TO ACCIDENTAL LOSS OR CORRUPTION.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">5. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL CHRONOS OR ITS DEVELOPERS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OR INABILITY TO USE THE APPLICATION.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 border-t border-border/40 pt-6">
            <h2 className="text-lg font-bold text-foreground">6. Contact Us</h2>
            <p>
              If you have any questions or require clarification regarding these Terms of Service, please reach out to us at:
            </p>
            <p className="font-semibold text-foreground">
              Email: <a href="mailto:mokshithnaik932@gmail.com" className="text-primary hover:underline">mokshithnaik932@gmail.com</a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 text-center text-xs text-muted-foreground">
        <p>© 2026 Chronos. All rights reserved.</p>
      </footer>
    </div>
  )
}
