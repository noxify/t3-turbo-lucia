import { Suspense } from "react"
import { redirect } from "next/navigation"

import { auth } from "@acme/auth"
import { Skeleton } from "@acme/ui/skeleton"

import { UpdateProfileForm } from "@/app/(authorized)/users/settings/components/update-profile"
import { api } from "@/trpc/server"

export default async function UsersSettingsPage() {
  const session = await auth()

  if (!session.user) {
    redirect("/auth")
  }

  const currentUser = await api.user.profile()

  return (
    <>
      <UpdateProfileForm user={currentUser} />
    </>
  )
}
