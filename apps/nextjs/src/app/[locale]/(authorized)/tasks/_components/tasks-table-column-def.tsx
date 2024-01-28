"use client"

import type { ColumnDef } from "@tanstack/react-table"
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircle2Icon,
  CircleIcon,
  HelpCircleIcon,
  MoreHorizontalIcon,
  TimerIcon,
  XCircleIcon,
} from "lucide-react"

import type {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
} from "@acme/ui/data-table"
import { schema } from "@acme/db"
import { DataTableColumnHeader } from "@acme/ui/data-table/column-header"
import { Badge } from "@acme/ui/ui/badge"
import { Button } from "@acme/ui/ui/button"
import { Checkbox } from "@acme/ui/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@acme/ui/ui/dropdown-menu"
import { toast } from "@acme/ui/ui/toast"

export function fetchTasksTableColumnDefs(
  isPending: boolean,
  startTransition: React.TransitionStartFunction,
): ColumnDef<typeof schema.task.$inferSelect, unknown>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value)
          }}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value)
          }}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Task" />
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.getValue("code")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        const label = schema.task.label.enumValues.find(
          (label) => label === row.original.label,
        )

        return (
          <div className="flex space-x-2">
            {label && <Badge variant="outline">{label}</Badge>}
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("title")}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = schema.task.status.enumValues.find(
          (status) => status === row.original.status,
        )

        if (!status) return null

        return (
          <div className="flex w-[100px] items-center">
            {status === "canceled" ? (
              <XCircleIcon
                className="mr-2 size-4 text-muted-foreground"
                aria-hidden="true"
              />
            ) : status === "done" ? (
              <CheckCircle2Icon
                className="mr-2 size-4 text-muted-foreground"
                aria-hidden="true"
              />
            ) : status === "in-progress" ? (
              <TimerIcon
                className="mr-2 size-4 text-muted-foreground"
                aria-hidden="true"
              />
            ) : status === "todo" ? (
              <HelpCircleIcon
                className="mr-2 size-4 text-muted-foreground"
                aria-hidden="true"
              />
            ) : (
              <CircleIcon
                className="mr-2 size-4 text-muted-foreground"
                aria-hidden="true"
              />
            )}
            <span className="capitalize">{status}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value instanceof Array && value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Priority" />
      ),
      cell: ({ row }) => {
        const priority = schema.task.priority.enumValues.find(
          (priority) => priority === row.original.priority,
        )

        if (!priority) {
          return null
        }

        return (
          <div className="flex items-center">
            {priority === "low" ? (
              <ArrowDownIcon
                className="mr-2 size-4 text-muted-foreground"
                aria-hidden="true"
              />
            ) : priority === "medium" ? (
              <ArrowRightIcon
                className="mr-2 size-4 text-muted-foreground"
                aria-hidden="true"
              />
            ) : priority === "high" ? (
              <ArrowUpIcon
                className="mr-2 size-4 text-muted-foreground"
                aria-hidden="true"
              />
            ) : (
              <CircleIcon
                className="mr-2 size-4 text-muted-foreground"
                aria-hidden="true"
              />
            )}
            <span className="capitalize">{priority}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value instanceof Array && value.includes(row.getValue(id))
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Open menu"
              variant="ghost"
              className="flex size-8 p-0 data-[state=open]:bg-muted"
            >
              <MoreHorizontalIcon className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={row.original.label}
                  onValueChange={(value) => {
                    startTransition(async () => {
                      await updateTaskLabel({
                        id: row.original.id,
                        label: value as Task["label"],
                      })
                    })
                  }}
                >
                  {schema.task.label.enumValues.map((label) => (
                    <DropdownMenuRadioItem
                      key={label}
                      value={label}
                      className="capitalize"
                      disabled={isPending}
                    >
                      {label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                startTransition(() => {
                  row.toggleSelected(false)

                  toast.promise(
                    deleteTask({
                      id: row.original.id,
                    }),
                    {
                      loading: "Deleting...",
                      success: () => "Task deleted successfully.",
                      error: (err: unknown) => catchError(err),
                    },
                  )
                })
              }}
            >
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
}

export const filterableColumns: DataTableFilterableColumn<
  typeof schema.task.$inferSelect
>[] = [
  {
    id: "status",
    title: "Status",
    options: schema.task.status.enumValues.map((status) => ({
      label: status[0]?.toUpperCase() + status.slice(1),
      value: status,
    })),
  },
  {
    id: "priority",
    title: "Priority",
    options: schema.task.priority.enumValues.map((priority) => ({
      label: priority[0]?.toUpperCase() + priority.slice(1),
      value: priority,
    })),
  },
]

export const searchableColumns: DataTableSearchableColumn<
  typeof schema.task.$inferSelect
>[] = [
  {
    id: "title",
    title: "titles",
  },
]
