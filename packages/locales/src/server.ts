import { createI18nServer } from "next-international/server"

import { en } from "./lang"

export const { getI18n, getScopedI18n, getCurrentLocale, getStaticParams } =
  createI18nServer(
    {
      en: () => import("./generated/en"),
      de: () => import("./generated/de"),
    },
    {
      fallbackLocale: en,
    },
  )
