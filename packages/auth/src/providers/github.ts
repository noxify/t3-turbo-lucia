import type { Endpoints } from "@octokit/types"
import { GitHub } from "arctic"
import { generateId } from "lucia"

import { db } from "@acme/db/client"
import { Account, User } from "@acme/db/schema"

import { env } from "../../env"

const github = new GitHub(env.AUTH_GITHUB_ID, env.AUTH_GITHUB_SECRET)

export const name = "Github"
export const getAuthorizationUrl = async (state: string) => {
  return await github.createAuthorizationURL(state, {
    scopes: ["read:user", "user:email"],
  })
}

export const handleCallback = async (code: string) => {
  const tokens = await github.validateAuthorizationCode(code)

  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
    },
  })
  const githubUser =
    (await response.json()) as Endpoints["GET /user"]["response"]["data"]

  const existingAccount = await db.query.Account.findFirst({
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
      )
    },
  })

  if (existingAccount) {
    return existingAccount.userId
  }

  let userId = generateId(15)
  let userEmail: string

  if (!githubUser.email) {
    // If the user does not have a public email, get another via the GitHub API
    // See https://docs.github.com/en/rest/users/emails#list-public-email-addresses-for-the-authenticated-user
    const res = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        "User-Agent": "luciaauth",
      },
    })

    if (res.ok) {
      const emails =
        (await res.json()) as Endpoints["GET /user/emails"]["response"]["data"]

      const primaryEmail = emails.find((ele) => ele.primary)

      // use first email from the /users/emails endpoint in case we can't fetch the primary email
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      userEmail = primaryEmail?.email ?? emails[0]!.email
    }
  }

  await db.transaction(async (tx) => {
    const existingUser = await tx.query.User.findFirst({
      columns: {
        id: true,
      },
      where: (users, { and, eq }) => {
        return and(eq(users.email, userEmail))
      },
    })

    if (!existingUser) {
      await tx.insert(User).values({
        id: userId,
        name: githubUser.login,
        email: userEmail,
      })
    } else {
      userId = existingUser.id
    }

    await tx.insert(Account).values({
      providerId: "github",
      providerUserId: githubUser.id.toString(),
      userId,
    })
  })

  return userId
}
