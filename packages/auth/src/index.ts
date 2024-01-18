import type { Session, User } from "lucia"
import { cache } from "react"
import { cookies } from "next/headers"
import { DrizzleMySQLAdapter } from "@lucia-auth/adapter-drizzle"
import { Lucia } from "lucia"

import { db, schema } from "@acme/db"

import * as discordProvider from "./providers/discord"
import * as githubProvider from "./providers/github"

const adapter = new DrizzleMySQLAdapter(db, schema.sessions, schema.users)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
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
    if (result.session && result.session.fresh) {
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
    DatabaseUserAttributes: Omit<typeof schema.users.$inferSelect, "id">
    DatabaseSessionAttributes: Pick<
      typeof schema.sessions.$inferSelect,
      "ipAddress" | "userAgent"
    >
  }
}
