import type { Metadata } from "next"
import Link from "next/link"
import { Clock, Shield, ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy | Chronos",
  description: "Read the Privacy Policy for Chronos. Learn how we protect your data with our local-first, privacy-by-design productivity workspace.",
  keywords: ["privacy policy", "data protection", "local first privacy", "chronos privacy", "private time tracker"],
}

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-black tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last Updated: June 30, 2026</p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Shield className="size-4 text-primary" /> 1. Our Privacy Philosophy
            </h2>
            <p>
              At Chronos, we believe that your productivity data is deeply personal. Our platform is built on a <strong>local-first architecture</strong>. This means that by default, all your focus sessions, tasks, habits, calendar events, notes, and metrics are processed and stored locally on your own device. We do not run background telemetry to track your activity, and we have no interest in selling or monetizing your personal data.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">2. Data We Collect</h2>
            <p>
              Depending on how you interact with Chronos, we may collect the following limited categories of information:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Local Application Data</strong>: All data you input—including task names, project details, logged hours, and habit consistency—is stored in a local database on your machine. We do not have access to this data.
              </li>
              <li>
                <strong>Support Communications</strong>: If you contact us directly via email, we will receive your email address, name, and any information you choose to provide in your message so we can assist you.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">3. How We Use Your Data</h2>
            <p>
              We use the limited information we collect strictly for the following purposes:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide customer support and respond to your inquiries.</li>
              <li>To maintain and improve the performance of the local application.</li>
              <li>To comply with applicable legal obligations or protect our rights.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">4. Data Storage and Security</h2>
            <p>
              Because your database is stored locally, the security of your data largely depends on the security of your device. We recommend securing your machine with strong passwords and enabling disk encryption (such as BitLocker or FileVault) to prevent unauthorized physical access to your local database.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">5. Your Data Rights</h2>
            <p>
              Since your data resides on your machine, you have complete control over it. You can export, modify, or delete your entire database directly from the application settings at any time. There are no account deletion requests or data retrieval delays.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 border-t border-border/40 pt-6">
            <h2 className="text-lg font-bold text-foreground">6. Contact Us</h2>
            <p>
              If you have any questions, concerns, or feedback regarding this Privacy Policy or our data practices, please contact us at:
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
