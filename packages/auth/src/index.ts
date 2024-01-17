import type { Endpoints } from "@octokit/types";
import type { DiscordTokens } from "arctic";
import type { Session, User } from "lucia";
import { cache } from "react";
import { cookies } from "next/headers";
import { DrizzleMySQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Discord, GitHub } from "arctic";
import { Lucia } from "lucia";

import { db, schema } from "@acme/db";

import { env } from "../env.mjs";

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<typeof schema.users.$inferSelect, "id">;
  }
}

const adapter = new DrizzleMySQLAdapter(db, schema.sessions, schema.users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      name: attributes.name,
    };
  },
});

export type AuthResponse =
  | { user: User; session: Session }
  | { user: null; session: null };

export const auth = cache(async (): Promise<AuthResponse> => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);
  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {
    /* empty */
  }
  return result;
});

export const github = new GitHub(env.AUTH_GITHUB_ID, env.AUTH_GITHUB_SECRET);

export const discord = new Discord(
  env.AUTH_DISCORD_ID,
  env.AUTH_DISCORD_SECRET,
  "http://localhost:3000/auth/discord/callback",
);

export type { DiscordTokens };

export type GithubUser = Endpoints["GET /user"];
export type GithubUserEmail = Endpoints["GET /user/emails"];

export type { APIUser as DiscordUser } from "discord-api-types/v10";
