import { redirect } from "next/navigation"
import { userAgentFromString } from "next/server"
import { BellRing, MonitorIcon, SmartphoneIcon, Trash2Icon } from "lucide-react"

import { auth, lucia } from "@acme/auth"
import { Button } from "@acme/ui/button"

import { invalivateSessionAction } from "@/actions/sessions"
import { UpdateProfileForm } from "@/app/(authorized)/users/settings/components/update-profile"

export default async function UsersSettingsPage() {
  const session = await auth()

  if (!session.user) {
    redirect("/auth")
  }

  return (
    <>
      <UpdateProfileForm user={session.user} />
    </>
  )
}
