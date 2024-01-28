import type { Column } from "@tanstack/react-table"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDownIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={
              column.getIsSorted() === "desc"
                ? `Sorted descending. Click to sort ascending.`
                : column.getIsSorted() === "asc"
                  ? `Sorted ascending. Click to sort descending.`
                  : `Not sorted. Click to sort ascending.`
            }
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDownIcon className="ml-2 size-4" aria-hidden="true" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 size-4" aria-hidden="true" />
            ) : (
              <ChevronsUpDownIcon className="ml-2 size-4" aria-hidden="true" />
            )}
          </Button>
        </DropdownMenuTrigger>
        {(column.getCanSort() || column.getCanHide()) && (
          <DropdownMenuContent align="start">
            {column.getCanSort() && (
              <>
                <DropdownMenuItem
                  aria-label="Sort ascending"
                  onClick={() => column.toggleSorting(false)}
                >
                  <ArrowUpIcon
                    className="mr-2 size-3.5 text-muted-foreground/70"
                    aria-hidden="true"
                  />
                  Asc
                </DropdownMenuItem>
                <DropdownMenuItem
                  aria-label="Sort descending"
                  onClick={() => column.toggleSorting(true)}
                >
                  <ArrowDownIcon
                    className="mr-2 size-3.5 text-muted-foreground/70"
                    aria-hidden="true"
                  />
                  Desc
                </DropdownMenuItem>
              </>
            )}
            {column.getCanSort() && column.getCanHide() && (
              <DropdownMenuSeparator />
            )}
            {column.getCanHide() && (
              <DropdownMenuItem
                aria-label={
                  column.getIsVisible()
                    ? `Hide column ${title}`
                    : `Show column ${title}`
                }
                onClick={() => column.toggleVisibility(!column.getIsVisible())}
              >
                {column.getIsVisible() ? (
                  <>
                    <EyeOffIcon
                      className="mr-2 size-3.5 text-muted-foreground/70"
                      aria-hidden="true"
                    />
                    Hide
                  </>
                ) : (
                  <>
                    <EyeIcon
                      className="mr-2 size-3.5 text-muted-foreground/70"
                      aria-hidden="true"
                    />
                    Show
                  </>
                )}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  )
}
