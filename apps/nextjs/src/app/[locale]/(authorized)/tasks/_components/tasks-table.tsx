"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { use, useMemo, useTransition } from "react"

import type { RouterOutputs } from "@acme/api"
import type { schema } from "@acme/db"
import { DataTable } from "@acme/ui/data-table"
import { useDataTable } from "@acme/ui/hooks/use-data-table"

import { api } from "@/trpc/react"
import {
  deleteSelectedRows,
  TasksTableFloatingBarContent,
} from "./tasks-table-actions"
import {
  fetchTasksTableColumnDefs,
  filterableColumns,
  searchableColumns,
} from "./tasks-table-column-def"

interface TasksTableProps {
  tasksPromise: Promise<RouterOutputs["task"]["all"]>
}

export function TasksTable({ tasksPromise }: TasksTableProps) {
  // Learn more about React.use here: https://react.dev/reference/react/use

  const { data, pageCount } = use(tasksPromise)
  // const { data } = api.task.all.useQuery(
  //   {},
  //   {
  //     initialData: {
  //       data: initialData,
  //       pageCount,
  //     },
  //   },
  // )

  const [isPending, startTransition] = useTransition()

  // Memoize the columns so they don't re-render on every render
  const columns = useMemo<
    ColumnDef<typeof schema.task.$inferSelect, unknown>[]
  >(() => fetchTasksTableColumnDefs(isPending, startTransition), [isPending])

  const { dataTable } = useDataTable({
    data,
    columns,
    pageCount,
    searchableColumns,
    filterableColumns,
  })

  return (
    <DataTable
      dataTable={dataTable}
      columns={columns}
      searchableColumns={searchableColumns}
      filterableColumns={filterableColumns}
      // floatingBarContent={TasksTableFloatingBarContent(dataTable)}
      // deleteRowsAction={(event) => deleteSelectedRows(dataTable, event)}
    />
  )
}
