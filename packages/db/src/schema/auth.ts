/**
 * Source:
 * - https://v3.lucia-auth.com/database/drizzle
 * - https://v3.lucia-auth.com/guides/oauth/multiple-providers
 */

import { relations } from "drizzle-orm";
import { datetime, index, primaryKey, varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";

export const users = mySqlTable("user", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
});

export const sessions = mySqlTable("session", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 255,
  })
    .notNull()
    .references(() => users.id),
  expiresAt: datetime("expires_at").notNull(),
});

export const accounts = mySqlTable(
  "account",
  {
    providerId: varchar("provider_id", { length: 255 }).notNull(),
    providerUserId: varchar("provider_user_id", { length: 255 }).notNull(),
    userId: varchar("user_id", {
      length: 255,
    })
      .notNull()
      .references(() => users.id),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.providerId, account.providerUserId],
    }),
    userIdIdx: index("userId_idx").on(account.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));
