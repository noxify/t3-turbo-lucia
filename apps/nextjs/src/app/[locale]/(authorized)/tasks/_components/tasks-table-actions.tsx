import type { Table } from "@tanstack/react-table"
import * as React from "react"
import { unstable_noStore as noStore } from "next/cache"
import { ArrowUpIcon, CheckCircle2Icon, TrashIcon } from "lucide-react"

import type { TaskPriority, TaskStatus } from "@acme/db"
import { schema } from "@acme/db"
import { catchError } from "@acme/ui/catch-error"
import { Button } from "@acme/ui/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@acme/ui/ui/select"
import { toast } from "@acme/ui/ui/toast"

import {
  deleteTask,
  updateTaskPriority,
  updateTaskStatus,
} from "@/actions/task-table-actions"

export function deleteSelectedRows(
  table: Table<typeof schema.task.$inferSelect>,
  event?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
) {
  event?.preventDefault()
  const selectedRows = table.getFilteredSelectedRowModel().rows as {
    original: typeof schema.task.$inferSelect
  }[]

  noStore()
  toast.promise(
    Promise.all(
      selectedRows.map(async (row) =>
        deleteTask({
          id: row.original.id,
        }),
      ),
    ),
    {
      loading: "Deleting...",
      success: () => {
        return "Tasks deleted successfully."
      },
      error: (err: unknown) => {
        return catchError(err)
      },
    },
  )
}

export function updateTasksStatus(
  table: Table<typeof schema.task.$inferSelect>,
  status: string,
) {
  const selectedRows = table.getFilteredSelectedRowModel().rows as unknown as {
    original: typeof schema.task.$inferSelect
  }[]

  noStore()
  toast.promise(
    Promise.all(
      selectedRows.map(async (row) =>
        updateTaskStatus({
          id: row.original.id,
          status: status as TaskStatus,
        }),
      ),
    ),
    {
      loading: "Updating...",
      success: () => {
        return "Tasks updated successfully."
      },
      error: (err: unknown) => {
        return catchError(err)
      },
    },
  )
}

export function updateTasksPriority(
  table: Table<typeof schema.task.$inferSelect>,
  priority: string,
) {
  const selectedRows = table.getFilteredSelectedRowModel().rows as unknown as {
    original: typeof schema.task.$inferSelect
  }[]

  noStore()
  toast.promise(
    Promise.all(
      selectedRows.map(async (row) =>
        updateTaskPriority({
          id: row.original.id,
          priority: priority as TaskPriority,
        }),
      ),
    ),
    {
      loading: "Updating...",
      success: () => {
        return "Tasks updated successfully."
      },
      error: (err: unknown) => {
        return catchError(err)
      },
    },
  )
}

export function TasksTableFloatingBarContent(
  table: Table<typeof schema.task.$inferSelect>,
) {
  return (
    <div className="justify-between gap-2 align-middle">
      <Select onValueChange={(value) => updateTasksStatus(table, value)}>
        <SelectTrigger asChild>
          <Button
            aria-label="Delete selected rows"
            title="Status"
            variant="ghost"
            size="icon"
            className="size-7 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
          >
            <CheckCircle2Icon className="size-4" aria-hidden="true" />
          </Button>
        </SelectTrigger>
        <SelectContent align="center">
          <SelectGroup>
            {schema.task.status.enumValues.map((status) => (
              <SelectItem key={status} value={status} className="capitalize">
                {status}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => updateTasksPriority(table, value)}>
        <SelectTrigger asChild>
          <Button
            title="Priority"
            variant="ghost"
            size="icon"
            className="size-7 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
          >
            <ArrowUpIcon className="size-4" aria-hidden="true" />
          </Button>
        </SelectTrigger>
        <SelectContent align="center">
          <SelectGroup>
            {schema.task.priority.enumValues.map((priority) => (
              <SelectItem
                key={priority}
                value={priority}
                className="capitalize"
              >
                {priority}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button
        title="Delete"
        variant="ghost"
        size="icon"
        className="size-7"
        onClick={(event) => {
          table.toggleAllPageRowsSelected(false)
          deleteSelectedRows?.(table, event)
        }}
      >
        <TrashIcon className="size-4" aria-hidden="true" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  )
}
