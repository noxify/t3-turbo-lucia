import { z } from "zod"

import { and, asc, desc, eq, inArray, or, schema, sql } from "@acme/db"
import { filterColumn } from "@acme/db/filter"

import { createTRPCRouter, protectedProcedure } from "../trpc"

type TaskFields = keyof typeof schema.task.$inferSelect

export const taskRouter = createTRPCRouter({
  all: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(10),
        offset: z.number().optional().default(0),
        operator: z.enum(["and", "or"]).optional().default("and"),
        title: z.string().optional(),
        statuses: z
          .enum(["todo", "in-progress", "done", "canceled"])
          .array()
          .optional()
          .default([]),
        priorities: z
          .enum(["low", "medium", "high"])
          .array()
          .optional()
          .default([]),
        orderField: z.string().optional().default("id"),
        orderDirection: z.enum(["asc", "desc"]).optional().default("desc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { data, count } = await ctx.db.transaction(async (tx) => {
          const data = await tx
            .select()
            .from(schema.task)
            .limit(input.limit)
            .offset(input.offset)
            .where(
              !input.operator || input.operator === "and"
                ? and(
                    // Filter tasks by title
                    input.title !== undefined
                      ? filterColumn({
                          column: schema.task.title,
                          value: input.title,
                        })
                      : undefined,
                    // Filter tasks by status
                    input.statuses.length > 0
                      ? inArray(schema.task.status, input.statuses)
                      : undefined,
                    // Filter tasks by priority
                    input.priorities.length > 0
                      ? inArray(schema.task.priority, input.priorities)
                      : undefined,
                  )
                : or(
                    // Filter tasks by title
                    input.title
                      ? filterColumn({
                          column: schema.task.title,
                          value: input.title,
                        })
                      : undefined,
                    // Filter tasks by status
                    input.statuses.length > 0
                      ? inArray(schema.task.status, input.statuses)
                      : undefined,
                    // Filter tasks by priority
                    input.priorities.length > 0
                      ? inArray(schema.task.priority, input.priorities)
                      : undefined,
                  ),
            )
            .orderBy(
              input.orderDirection === "asc"
                ? asc(schema.task[input.orderField as TaskFields])
                : desc(schema.task[input.orderField as TaskFields]),
            )

          const count = await tx
            .select({
              count: sql<number>`count(${schema.task.id})`.mapWith(Number),
            })
            .from(schema.task)
            .where(
              !input.operator || input.operator === "and"
                ? and(
                    // Filter tasks by title
                    input.title
                      ? filterColumn({
                          column: schema.task.title,
                          value: input.title,
                        })
                      : undefined,
                    // Filter tasks by status
                    input.statuses.length > 0
                      ? inArray(schema.task.status, input.statuses)
                      : undefined,
                    // Filter tasks by priority
                    input.priorities.length > 0
                      ? inArray(schema.task.priority, input.priorities)
                      : undefined,
                  )
                : or(
                    // Filter tasks by title
                    input.title
                      ? filterColumn({
                          column: schema.task.title,
                          value: input.title,
                        })
                      : undefined,
                    // Filter tasks by status
                    input.statuses.length > 0
                      ? inArray(schema.task.status, input.statuses)
                      : undefined,
                    // Filter tasks by priority
                    input.priorities.length > 0
                      ? inArray(schema.task.priority, input.priorities)
                      : undefined,
                  ),
            )
            .execute()
            .then((res) => res[0]?.count ?? 0)

          return {
            data,
            count,
          }
        })

        const pageCount = Math.ceil(count / input.limit)
        return { data, pageCount }
      } catch (err) {
        console.log(err)
        return { data: [], pageCount: 0 }
      }
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(schema.task).where(eq(schema.task.id, input))
  }),
})
