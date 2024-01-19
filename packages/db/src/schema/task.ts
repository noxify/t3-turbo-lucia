import { getTableColumns } from "drizzle-orm"
import { mysqlEnum, varchar } from "drizzle-orm/mysql-core"
import { customAlphabet } from "nanoid"

import { mySqlTable } from "./_table"

function createId() {
  return customAlphabet("1234567890abcdef", 16)()
}

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
})

export const taskFields = getTableColumns(task)
