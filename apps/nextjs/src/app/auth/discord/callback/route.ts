import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";

import type { DiscordUser } from "@acme/auth";
import { discord, lucia } from "@acme/auth";
import { db, schema } from "@acme/db";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("discord_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await discord.validateAuthorizationCode(code);

    const discordUserResponse = await fetch(
      "https://discord.com/api/users/@me",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );
    const discordUser = (await discordUserResponse.json()) as DiscordUser;
    const existingUser = await db.query.accounts.findFirst({
      columns: {
        userId: true,
      },

      where: (accounts, { and, eq }) => {
        return and(
          eq(accounts.providerId, "discord"),
          // since the id in github is a number, we have to convert it
          // to a string, because our accounts tables expects a string
          // easy peacy, lemon squeezy
          eq(accounts.providerUserId, discordUser.id),
        );
      },
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    let userId = generateId(15);
    const userEmail = discordUser.email!;

    await db.transaction(async (tx) => {
      const existingUser = await tx.query.users.findFirst({
        columns: {
          id: true,
        },
        where: (users, { and, eq }) => {
          return and(eq(users.email, userEmail));
        },
      });

      if (!existingUser) {
        await tx.insert(schema.users).values({
          id: userId,
          name: discordUser.username,
          email: userEmail,
        });
      } else {
        userId = existingUser.id;
      }

      await tx.insert(schema.accounts).values({
        providerId: "discord",
        providerUserId: discordUser.id,
        userId,
      });
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    console.log(e);
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}
