import { Suspense } from "react"
import { redirect } from "next/navigation"

import { auth } from "@acme/auth"

import {
  UpdateProfileForm,
  UpdateProfileFormSkeletion,
} from "@/app/[locale]/(authorized)/users/settings/components/profile"
import { api } from "@/trpc/server"

export default async function UsersSettingsPage() {
  const session = await auth()

  if (!session.user) {
    redirect("/auth")
  }

  const currentUser = api.user.profile()

  return (
    <>
      <Suspense fallback={<UpdateProfileFormSkeletion />}>
        <UpdateProfileForm user={currentUser} />
      </Suspense>
    </>
  )
}
