import { Suspense } from "react"
import { redirect } from "next/navigation"

import { auth } from "@acme/auth"
import { DataTableSkeleton } from "@acme/ui/data-table/skeleton"
import { Separator } from "@acme/ui/ui/separator"

import { api } from "@/trpc/server"

export default async function TasksPage() {
  const session = await auth()

  if (!session.user) {
    redirect("/auth")
  }

  const tasks = api.task.all()

  return (
    <div className="space-y-6 py-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
        <p className="text-muted-foreground">An awesome task manager</p>
      </div>
      <Separator className="my-6" />

      <div className="mx-auto flex w-full lg:max-w-2xl">
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={4} filterableColumnCount={2} />
          }
        >
          {/**
           * The `TasksTable` component is used to render the `DataTable` component within it.
           * This is done because the table columns need to be memoized, and the `useDataTable` hook needs to be called in a client component.
           * By encapsulating the `DataTable` component within the `tasktableshell` component, we can ensure that the necessary logic and state management is handled correctly.
           */}
          <TasksTable tasksPromise={tasks} />
        </Suspense>
      </div>
    </div>
  )
}
