"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, ArrowLeft, Send, Mail, MessageSquare, ShieldCheck, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function ContactPage() {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [subject, setSubject] = React.useState("")
  const [message, setMessage] = React.useState("")
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return

    setIsPending(true)
    // Simulate API call
    setTimeout(() => {
      setIsPending(false)
      setIsSubmitted(true)
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden relative">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-primary/5 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

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

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left Column: Contact Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
              Get in touch
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Have questions about Chronos? Need help setting up your workspace? We would love to hear from you.
            </p>
          </div>

          <div className="space-y-6 pt-4">
            {/* Info Card 1 */}
            <div className="flex gap-4 p-5 rounded-2xl border bg-card/50 backdrop-blur-md">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Mail className="size-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-foreground">Direct Support Email</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Send us an email and we will get back to you within 24 hours.
                </p>
                <a 
                  href="mailto:mokshithnaik932@gmail.com" 
                  className="text-xs font-bold text-primary hover:underline block pt-1.5"
                >
                  mokshithnaik932@gmail.com
                </a>
              </div>
            </div>

            {/* Info Card 2 */}
            <div className="flex gap-4 p-5 rounded-2xl border bg-card/50 backdrop-blur-md">
              <div className="size-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="size-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-foreground">100% Secure & Private</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your message is encrypted and sent directly to our secure inbox. We never share your email address.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="p-6 md:p-8 rounded-3xl border bg-card/40 backdrop-blur-xl shadow-xl space-y-6 relative">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form 
                key="contact-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit} 
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="contact-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                  <Input
                    id="contact-name"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="rounded-xl border-border/60 focus:ring-2 focus:ring-primary h-11 bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-xl border-border/60 focus:ring-2 focus:ring-primary h-11 bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-subject" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject (Optional)</Label>
                  <Input
                    id="contact-subject"
                    placeholder="How can we help?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="rounded-xl border-border/60 focus:ring-2 focus:ring-primary h-11 bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message</Label>
                  <Textarea
                    id="contact-message"
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="rounded-xl border-border/60 focus:ring-2 focus:ring-primary min-h-[120px] bg-background/50"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full h-12 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/95 hover:to-indigo-500/95 text-primary-foreground border-0 mt-2"
                >
                  {isPending ? (
                    <span>Sending message...</span>
                  ) : (
                    <>
                      <Send className="size-4" /> Send Message
                    </>
                  )}
                </Button>
              </motion.form>
            ) : (
              <motion.div 
                key="success-message"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6"
              >
                <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="size-10 animate-bounce" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight">Message Sent!</h3>
                  <p className="text-sm text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
                    Thank you for reaching out. We have received your message and will contact you at your email address shortly.
                  </p>
                </div>
                <Button 
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="rounded-xl font-semibold text-xs"
                >
                  Send Another Message
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 text-center text-xs text-muted-foreground mt-auto">
        <p>© 2026 Chronos. All rights reserved.</p>
      </footer>
    </div>
  )
}
