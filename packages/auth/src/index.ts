import type { Session, User } from "lucia"
import { cache } from "react"
import { cookies } from "next/headers"
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle"
import { Lucia } from "lucia"

import { db } from "@acme/db/client"
import { Session as SessionTable, User as UserTable } from "@acme/db/schema"

import { env } from "../env"
import * as discordProvider from "./providers/discord"
import * as githubProvider from "./providers/github"

const adapter = new DrizzlePostgreSQLAdapter(db, SessionTable, UserTable)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: env.NODE_ENV === "production",
    },
  },

  getSessionAttributes(databaseSessionAttributes) {
    return {
      userAgent: databaseSessionAttributes.userAgent,
      ipAddress: databaseSessionAttributes.ipAddress,
    }
  },

  getUserAttributes: (attributes) => {
    return {
      name: attributes.name,
      email: attributes.email,
    }
  },
})

export const auth = cache(async (): Promise<AuthResponse> => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null
  if (!sessionId) {
    return {
      user: null,
      session: null,
    }
  }

  const result = await lucia.validateSession(sessionId)
  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (result.session?.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id)
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      )
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie()
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      )
    }
  } catch {
    /* empty */
  }
  return result
})

export const providers = {
  github: githubProvider,
  discord: discordProvider,
} as const

export type Providers = keyof typeof providers

export type LuciaUser = User

export type AuthResponse =
  | { user: User; session: Session }
  | { user: null; session: null }
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: Omit<typeof UserTable.$inferSelect, "id">
    DatabaseSessionAttributes: Pick<
      typeof SessionTable.$inferSelect,
      "ipAddress" | "userAgent"
    >
  }
}
