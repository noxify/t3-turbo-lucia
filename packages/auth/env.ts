/* eslint-disable no-restricted-properties */
import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    AUTH_GITHUB_ID: z.string().min(1),
    AUTH_GITHUB_SECRET: z.string().min(1),
    AUTH_DISCORD_ID: z.string().min(1),
    AUTH_DISCORD_SECRET: z.string().min(1),
  },
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  client: {},
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
})
