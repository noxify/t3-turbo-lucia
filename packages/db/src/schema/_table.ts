import { mysqlTableCreator } from "drizzle-orm/mysql-core"
import { customAlphabet } from "nanoid"

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM.
 * Use the same database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mySqlTable = mysqlTableCreator((name) => `t3lucia_${name}`)

export function createId() {
  return customAlphabet("1234567890abcdef", 16)()
}
