"use client"

import { use } from "react"
import { userAgentFromString } from "next/server"
import { MonitorIcon, SmartphoneIcon, Trash2Icon } from "lucide-react"

import type { RouterOutputs } from "@acme/api"
import { Button } from "@acme/ui/button"
import { Skeleton } from "@acme/ui/skeleton"
import { toast } from "@acme/ui/toast"

import { api } from "@/trpc/react"

export function SessionList(props: {
  sessions: Promise<RouterOutputs["user"]["sessions"]>
  sessionId: string
}) {
  // TODO: Make `useSuspenseQuery` work without having to pass a promise from RSC
  const initialData = use(props.sessions)
  const { data: sessions } = api.user.sessions.useQuery(undefined, {
    initialData,
  })

  return (
    <>
      {sessions.map((session) => {
        return (
          <SessionCard
            key={session.id}
            session={session}
            sessionId={props.sessionId}
          />
        )
      })}
    </>
  )
}

export function SessionCard(props: {
  session: RouterOutputs["user"]["sessions"][number]
  sessionId: string
}) {
  const utils = api.useUtils()
  const deleteSession = api.user.deleteSession.useMutation({
    onSuccess: async () => {
      await utils.user.invalidate()
    },
    onError: (err) => {
      toast.error(
        err?.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to manage your session"
          : "Failed to delete selected session",
      )
    },
  })

  const ua = userAgentFromString(props.session.userAgent ?? "")
  const isMobile = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      props.session.userAgent ?? "",
    )

  return (
    <div className=" flex w-full items-center space-x-4 rounded-md border p-4">
      {isMobile() ? <SmartphoneIcon /> : <MonitorIcon />}
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">
          {ua.os.name} - {ua.browser.name}
        </p>
        <p className="text-sm text-muted-foreground">
          {props.session.ipAddress === "::1"
            ? "127.0.0.1 (localhost)"
            : props.session.ipAddress}{" "}
          {props.session.id === props.sessionId && " - Current session"}
        </p>
      </div>
      {props.session.id !== props.sessionId && (
        <Button
          size="icon"
          variant="destructive"
          onClick={() => {
            deleteSession.mutate({ sessionId: props.session.id })
          }}
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

export const SessionCardSkeleton = () => {
  return (
    <div className=" flex w-full items-center space-x-4 rounded-md border p-4">
      <Skeleton className="h-8 w-8 rounded-full" />

      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">
          <Skeleton className="h-4 w-[150px]" />
        </p>
        <p className="text-sm text-muted-foreground">
          <Skeleton className="h-4 w-[250px]" />
        </p>
      </div>
    </div>
  )
}
