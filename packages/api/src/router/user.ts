import { TRPCError } from "@trpc/server"

import { lucia } from "@acme/auth"
import { eq, schema } from "@acme/db"
import { DeleteSessionSchema, UpdateProfileSchema } from "@acme/validators"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const userRouter = createTRPCRouter({
  profile: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.users.findFirst({
      where: eq(schema.users.id, ctx.session.user.id),
    })
  }),
  updateProfile: protectedProcedure
    .input(UpdateProfileSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(schema.users)
        .set(input)
        .where(eq(schema.users.id, ctx.session.user.id))
    }),

  sessions: protectedProcedure.query(({ ctx }) => {
    return lucia.getUserSessions(ctx.session.user?.id)
  }),

  deleteSession: protectedProcedure
    .input(DeleteSessionSchema)
    .mutation(async ({ ctx, input }) => {
      const userSessions = await lucia.getUserSessions(ctx.session.user.id)

      if (userSessions.find((ele) => ele.id === input.sessionId)) {
        return await lucia.invalidateSession(input.sessionId)
      } else {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
    }),
})
