import type { ReactNode } from "react"

import { LocaleProvider } from "@acme/locales/provider"
import { LanguageToggle } from "@acme/ui/language"
import { ThemeToggle } from "@acme/ui/theme"

export interface LocaleLayoutProps {
  children: ReactNode
  params: {
    locale: string
  }
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  return (
    <LocaleProvider params={params}>
      {children}

      <div className="absolute bottom-4 right-4 space-x-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </LocaleProvider>
  )
}
