import type { NextFetchEvent, NextRequest } from "next/server"

import { createI18nMiddleware } from "@acme/locales"

import type { CustomMiddleware } from "~/middlewares/chain-middleware"

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "de"],
  defaultLocale: "en",
  urlMappingStrategy: "rewrite",
})

export function withI18n(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = I18nMiddleware(request)

    return middleware(request, event, response)
  }
}
