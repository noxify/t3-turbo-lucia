import Link from "next/link"

import { auth, providers } from "@acme/auth"
import { getI18n } from "@acme/locales/server"
import { Button } from "@acme/ui/button"

import { Logout } from "~/app/_components/logout"

export async function AuthShowcase() {
  const t = await getI18n()
  const { session, user } = await auth()

  if (!session) {
    return (
      <div>
        {Object.entries(providers).map(([providerKey, provider], index) => (
          <Button
            variant="outline"
            type="button"
            asChild
            key={index}
            className="mr-2 last:mr-0"
          >
            <Link href={`/api/auth/${providerKey}/login`} prefetch={false}>
              {t("auth.headline")} {provider.name}
            </Link>
          </Button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        <span>{t("welcome", { name: user.name })}</span>
      </p>
      <Logout />
    </div>
  )
}
