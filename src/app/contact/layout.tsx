import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us | Chronos",
  description: "Get in touch with the Chronos support team. Reach out via our secure form or email at mokshithnaik932@gmail.com.",
  keywords: ["contact support", "chronos help", "customer service", "email support", "mokshithnaik932@gmail.com"],
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
