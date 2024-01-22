"use client"

import Link from "next/link"
import { UserIcon } from "lucide-react"

import { useI18n } from "@acme/locales/client"
import { Button } from "@acme/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu"

import { logoutAction } from "@/actions/logout"
import { api } from "@/trpc/react"

export function UserMenu() {
  const t = useI18n()
  const { data: user } = api.user.profile.useQuery()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {t("welcome", { name: user?.name })}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/users/settings">
            <DropdownMenuItem>{t("common.settings")}</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <form action={logoutAction}>
          <DropdownMenuItem>
            <button>{t("auth.signout")}</button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
