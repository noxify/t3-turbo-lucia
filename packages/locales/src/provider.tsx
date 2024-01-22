"use client"

import type { ReactNode } from "react"

import { I18nProviderClient } from "./client"

interface LocaleProviderProps {
  children: ReactNode
  params: {
    locale: string
  }
}

export function LocaleProvider({ children, params }: LocaleProviderProps) {
  return <I18nProviderClient {...params}>{children}</I18nProviderClient>
}
