import { Suspense } from "react"
import { redirect } from "next/navigation"
import { userAgentFromString } from "next/server"
import { MonitorIcon, SmartphoneIcon, Trash2Icon } from "lucide-react"

import { auth } from "@acme/auth"
import { Button } from "@acme/ui/button"
import { Skeleton } from "@acme/ui/skeleton"

import { invalivateSessionAction } from "@/actions/sessions"
import { SessionList } from "@/app/(authorized)/users/settings/components/sessions"
import { api } from "@/trpc/server"

export default async function SessionsPage() {
  const session = await auth()

  if (!session.user) {
    redirect("/auth")
  }

  const sessions = api.user.sessions()

  return (
    <>
      <div className="grid w-full gap-y-2">
        <Suspense
          fallback={
            <div className="flex w-full flex-col gap-4">
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </div>
          }
        >
          <SessionList sessions={sessions} sessionId={session.session.id} />
        </Suspense>
      </div>
    </>
  )
}
