import { createI18nServer } from "next-international/server"

import * as en from "./generated/en"

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
