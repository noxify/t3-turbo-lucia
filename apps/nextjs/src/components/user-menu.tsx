"use client"

import Link from "next/link"
import { UserIcon } from "lucide-react"

import { useI18n } from "@acme/locales/client"
import { Button } from "@acme/ui/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/ui/dropdown-menu"

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
            <p
              className="text-sm leading-none"
              dangerouslySetInnerHTML={{
                __html: t("welcome", { name: user?.name }),
              }}
            ></p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/users/settings" className="cursor-pointer">
              {t("common.settings")}
            </Link>
          </DropdownMenuItem>
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
