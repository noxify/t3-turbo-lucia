import type { Config } from "drizzle-kit"

import { env } from "./env"

export default {
  schema: "./src/schema.ts",
  dialect: "postgresql",
  migrations: {
    schema: "public",
  },
  dbCredentials: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },
  tablesFilter: ["t3turbo_*"],
} satisfies Config
