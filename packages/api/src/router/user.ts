import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { lucia } from "@acme/auth"
import { eq } from "@acme/db"
import { UpdateUserSchema, User } from "@acme/db/schema"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const userRouter = createTRPCRouter({
  profile: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.User.findFirst({
      where: eq(User.id, ctx.session.user.id),
    })
  }),
  updateProfile: protectedProcedure
    .input(UpdateUserSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(User)
        .set(input)
        .where(eq(User.id, ctx.session.user.id))
    }),

  sessions: protectedProcedure.query(async ({ ctx }) => {
    return lucia.getUserSessions(ctx.session.user.id)
  }),

  deleteSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userSessions = await lucia.getUserSessions(ctx.session.user.id)

      if (userSessions.find((ele) => ele.id === input.sessionId)) {
        return await lucia.invalidateSession(input.sessionId)
      } else {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
    }),
})
