import type { Task } from "@acme/db"
import {
  and,
  asc,
  countDistinct,
  desc,
  filterColumn,
  inArray,
  schema,
} from "@acme/db"
import { ListTasksSchema } from "@acme/validators"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const taskRouter = createTRPCRouter({
  list: protectedProcedure
    .input(ListTasksSchema)
    .query(async ({ ctx, input }) => {
      const page = input.page < 1 ? 1 : input.page
      // Number of items per page
      const limit =
        isNaN(input.per_page) || input.per_page < 1 ? 10 : input.per_page
      // Number of items to skip
      const offset = page > 0 ? (page - 1) * limit : 0
      // return ctx.db.select().from(schema.post).orderBy(desc(schema.post.id));

      const statuses = (input.status as Task["status"][]) ?? []
      const priorities = (input.priority as Task["priority"][]) ?? []

      const { data, count } = await ctx.db.transaction(async (tx) => {
        const whereCondition = and(
          // Filter tasks by title
          input.title
            ? filterColumn({
                column: schema.task.title,
                value: input.title,
              })
            : undefined,
          // Filter tasks by status
          statuses.length > 0
            ? inArray(schema.taskFields.status, statuses)
            : undefined,
          // Filter tasks by priority
          priorities.length > 0
            ? inArray(schema.task.priority, priorities)
            : undefined,
        )

        const data = await tx
          .select()
          .from(schema.task)
          .where(whereCondition)

          .groupBy(
            input.sort.direction === "desc"
              ? desc(schema.task[input.sort.field])
              : asc(schema.task[input.sort.field]),
          )
          .limit(limit)
          .offset(offset)
          .$dynamic()

        const count = await tx
          .select({ value: countDistinct(schema.task.id) })
          .from(schema.task)
          .where(whereCondition)

        return {
          data,
          count,
        }
      })

      return ctx.db.query.post.findMany({
        orderBy: desc(schema.post.id),
        limit: limit,
        offset: offset,
      })
    }),

  // byId: publicProcedure
  //   .input(z.object({ id: z.number() }))
  //   .query(({ ctx, input }) => {
  //     // return ctx.db
  //     //   .select()
  //     //   .from(schema.post)
  //     //   .where(eq(schema.post.id, input.id));

  //     return ctx.db.query.post.findFirst({
  //       where: eq(schema.post.id, input.id),
  //     })
  //   }),

  // create: protectedProcedure
  //   .input(CreatePostSchema)
  //   .mutation(({ ctx, input }) => {
  //     return ctx.db.insert(schema.post).values(input)
  //   }),

  // delete: protectedProcedure.input(z.number()).mutation(({ ctx, input }) => {
  //   return ctx.db.delete(schema.post).where(eq(schema.post.id, input))
  // }),
})
