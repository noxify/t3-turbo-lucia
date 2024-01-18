import { eq, schema } from "@acme/db"
import { UpdateProfileSchema } from "@acme/validators"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const userRouter = createTRPCRouter({
  updateProfile: protectedProcedure
    .input(UpdateProfileSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(schema.users)
        .set(input)
        .where(eq(schema.users.id, ctx.session.user.id))
    }),
})
