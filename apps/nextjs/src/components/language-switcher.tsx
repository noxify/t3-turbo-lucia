import { Suspense } from "react"

import { ChangeLocaleButton } from "@/components/change-language-button"

export function LanguageSwitcher() {
  return (
    <Suspense>
      <ChangeLocaleButton />
    </Suspense>
  )
}
