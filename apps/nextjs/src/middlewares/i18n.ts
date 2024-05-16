import { createI18nMiddleware } from "@acme/locales"

import type { MiddlewareFunction } from "~/middlewares/compose-middleware"

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "de"],
  defaultLocale: "en",
  urlMappingStrategy: "rewrite",
})

// eslint-disable-next-line @typescript-eslint/require-await
export const handleI18n: MiddlewareFunction = async (request) => {
  return I18nMiddleware(request)
}
