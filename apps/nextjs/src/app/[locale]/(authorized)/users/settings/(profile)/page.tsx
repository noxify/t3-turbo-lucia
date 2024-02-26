import { Suspense } from "react"

import {
  UpdateProfileForm,
  UpdateProfileFormSkeletion,
} from "@/app/[locale]/(authorized)/users/settings/components/profile"
import { api } from "@/trpc/server"

export default async function UsersSettingsPage() {
  const currentUser = api.user.profile()

  return (
    <>
      <Suspense fallback={<UpdateProfileFormSkeletion />}>
        <UpdateProfileForm user={currentUser} />
      </Suspense>
    </>
  )
}
