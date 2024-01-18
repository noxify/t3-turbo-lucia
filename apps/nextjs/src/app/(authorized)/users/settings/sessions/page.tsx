import { redirect } from "next/navigation"
import { userAgentFromString } from "next/server"
import { BellRing, MonitorIcon, SmartphoneIcon, Trash2Icon } from "lucide-react"

import { auth, lucia } from "@acme/auth"
import { Button } from "@acme/ui/button"

import { invalivateSessionAction } from "@/actions/sessions"

export default async function SessionsPage() {
  const session = await auth()

  if (!session.user) {
    redirect("/auth")
  }

  const sessions = await lucia.getUserSessions(session.user?.id)
  return (
    <>
      <div className="grid gap-y-2">
        {sessions.map((ele, index) => {
          const ua = userAgentFromString(ele.userAgent ?? "")
          const isMobile = () =>
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              ele.userAgent ?? "",
            )

          return (
            <div
              className=" flex w-full items-center space-x-4 rounded-md border p-4"
              key={index}
            >
              {isMobile() ? <SmartphoneIcon /> : <MonitorIcon />}
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {ua.os.name} - {ua.browser.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {ele.ipAddress === "::1"
                    ? "127.0.0.1 (localhost)"
                    : ele.ipAddress}{" "}
                  {ele.id === session.session.id && " - Current session"}
                </p>
              </div>
              {ele.id !== session.session.id && (
                <Button
                  size="icon"
                  variant="outline"
                  onClick={async () => {
                    "use server"
                    await invalivateSessionAction(ele.id)
                  }}
                >
                  <Trash2Icon />
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
