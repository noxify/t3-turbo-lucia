import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";

import type { GithubUser, GithubUserEmail } from "@acme/auth";
import { github, lucia } from "@acme/auth";
import { db, schema } from "@acme/db";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);

    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser =
      (await githubUserResponse.json()) as GithubUser["response"]["data"];

    const existingUser = await db.query.accounts.findFirst({
      columns: {
        userId: true,
      },

      where: (accounts, { and, eq }) => {
        return and(
          eq(accounts.providerId, "github"),
          // since the id in github is a number, we have to convert it
          // to a string, because our accounts tables expects a string
          // easy peacy, lemon squeezy
          eq(accounts.providerUserId, githubUser.id.toString()),
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

    let userEmail = githubUser.email;

    /**
     * This snippet is powered by
     * https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/github.ts
     *
     * But to be honest - i'm not sure if we should do this
     * We already defined the scope to get the email
     * if there is a reason to NOT get the email from the /user response
     * maybe we should respect this - Other question: Is this a dead end?
     * since we request the user email via the current scope definition
     */

    if (!userEmail) {
      // If the user does not have a public email, get another via the GitHub API
      // See https://docs.github.com/en/rest/users/emails#list-public-email-addresses-for-the-authenticated-user
      const res = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          "User-Agent": "luciaauth",
        },
      });

      if (res.ok) {
        const emails =
          (await res.json()) as GithubUserEmail["response"]["data"];
        userEmail =
          emails.find((ele) => ele.primary)?.email ?? emails[0]?.email ?? null;
      }
    }

    const userId = generateId(15);

    await db.transaction(async (tx) => {
      await tx.insert(schema.users).values({
        id: userId,
        name: githubUser.login,

        // This is the fallback value, to ensure it's not empty
        email: userEmail ?? `unknown-${userId}@github.com`,
      });

      await tx.insert(schema.accounts).values({
        providerId: "github",
        providerUserId: githubUser.id.toString(),
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
