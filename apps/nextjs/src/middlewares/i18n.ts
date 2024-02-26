import type { MiddlewareFunction } from "@/middlewares/compose-middleware"

import { createI18nMiddleware } from "@acme/locales"

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "de"],
  defaultLocale: "en",
  urlMappingStrategy: "rewrite",
})

export const handleI18n: MiddlewareFunction = async (request) => {
  return I18nMiddleware(request)
}
