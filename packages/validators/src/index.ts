import { z } from "zod"

import { schema } from "@acme/db"

export const CreatePostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
})

export const UpdateProfileSchema = z.object({
  name: z.string().min(1),
})

export const DeleteSessionSchema = z.object({
  sessionId: z.string().min(1),
})

export const DataTableBaseSchema = z.object({
  page: z.string().default("1"),
  per_page: z.string().default("10"),
  sort: z.string().optional(),
})

const taskFields = getZodEnumFromObjectKeys(schema.task.$inferSelect)

export const ListTasksSchema = z.object({
  page: z.number().optional().default(1),
  per_page: z.number().optional().default(10),
  sort: z
    .object({
      field: taskFields,
      direction: z.enum(["asc", "desc"]),
    })
    .optional()
    .default({ field: "title", direction: "desc" }),
  title: z.string().optional(),
  status: z.string().array(),
  priority: z.string().array(),
})

function getZodEnumFromObjectKeys<
  TI extends Record<string, unknown>,
  R extends string = TI extends Record<infer R, unknown> ? R : never,
>(input: TI): z.ZodEnum<[R, ...R[]]> {
  const [firstKey, ...otherKeys] = Object.keys(input) as [R, ...R[]]
  return z.enum([firstKey, ...otherKeys])
}
