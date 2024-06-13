/* eslint-disable no-restricted-properties */

import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  server: {
    DB_HOST: z.string().min(1),
    DB_PORT: z.coerce.number().default(5432),
    DB_USERNAME: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_NAME: z.string().min(1),
  },
  runtimeEnv: process.env,
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
})
