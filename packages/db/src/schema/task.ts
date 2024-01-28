import { sql } from "drizzle-orm"
import { mysqlEnum, timestamp, varchar } from "drizzle-orm/mysql-core"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"

import { createId, mySqlTable } from "./_table"

export const task = mySqlTable("task", {
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey(),
  code: varchar("code", { length: 255 }).unique(),
  title: varchar("title", { length: 255 }),
  status: mysqlEnum("status", ["todo", "in-progress", "done", "canceled"])
    .notNull()
    .default("todo"),
  label: mysqlEnum("label", ["bug", "feature", "enhancement", "documentation"])
    .notNull()
    .default("bug"),
  priority: mysqlEnum("priority", ["low", "medium", "high"])
    .notNull()
    .default("low"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
})

export const createTaskSchema = createInsertSchema(task)

export const updateTaskStatusSchema = createTaskSchema.pick({
  id: true,
  status: true,
})

export const updateTaskPrioritySchema = createTaskSchema.pick({
  id: true,
  priority: true,
})

export const updateTaskLabelSchema = createTaskSchema.pick({
  id: true,
  label: true,
})
