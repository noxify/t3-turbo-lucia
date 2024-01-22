import type { Metadata, Viewport } from "next"

import { TailwindIndicator } from "@acme/ui/tailwind-indicator"
import { ThemeProvider } from "@acme/ui/theme"
import { Toaster } from "@acme/ui/ui/toast"
import { cn } from "@acme/ui/utils"

import { TRPCReactProvider } from "@/trpc/react"

import "@/app/globals.css"

export const metadata: Metadata = {
  title: "T3-Turbo-Lucia",
  description: "Simple monorepo with drizzle and lucia auth",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <TailwindIndicator />

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
