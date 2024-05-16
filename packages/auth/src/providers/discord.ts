import type { APIUser as DiscordUser } from "discord-api-types/v10"
import { Discord } from "arctic"
import { OAuth2Scopes } from "discord-api-types/v10"
import { generateId } from "lucia"

import { db } from "@acme/db/client"
import { Account, User } from "@acme/db/schema"

import { env } from "../../env"

const discord = new Discord(
  env.AUTH_DISCORD_ID,
  env.AUTH_DISCORD_SECRET,
  "http://localhost:3000/api/auth/discord/callback",
)

export const name = "Discord"

export const getAuthorizationUrl = async (state: string) => {
  return await discord.createAuthorizationURL(state, {
    scopes: [OAuth2Scopes.Identify, OAuth2Scopes.Email],
  })
}

export const handleCallback = async (code: string) => {
  const tokens = await discord.validateAuthorizationCode(code)

  const response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
    },
  })
  const discordUser = (await response.json()) as DiscordUser

  const existingAccount = await db.query.Account.findFirst({
    columns: {
      userId: true,
    },

    where: (accounts, { and, eq }) => {
      return and(
        eq(accounts.providerId, "discord"),

        eq(accounts.providerUserId, discordUser.id),
      )
    },
  })

  if (existingAccount) {
    return existingAccount.userId
  }

  let userId = generateId(15)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userEmail = discordUser.email!

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
        name: discordUser.username,
        email: userEmail,
      })
    } else {
      userId = existingUser.id
    }

    await tx.insert(Account).values({
      providerId: "discord",
      providerUserId: discordUser.id,
      userId,
    })
  })

  return userId
}
