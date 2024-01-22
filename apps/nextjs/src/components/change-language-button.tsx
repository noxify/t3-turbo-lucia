"use client"

import { CheckIcon, LanguagesIcon } from "lucide-react"

import { useChangeLocale, useCurrentLocale } from "@acme/locales/client"
import { cn } from "@acme/ui"
import { Button } from "@acme/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu"

export function ChangeLocaleButton() {
  const changeLocale = useChangeLocale({ preserveSearchParams: true })
  const currentLanguage = useCurrentLocale()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <LanguagesIcon className="size-5" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLocale("de")}>
          <CheckIcon
            className={cn(
              "mr-2 h-4 w-4",
              currentLanguage !== "de" ? "hidden" : "",
            )}
          />
          <span>DE</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLocale("en")}>
          <CheckIcon
            className={cn(
              "mr-2 h-4 w-4",
              currentLanguage !== "en" ? "hidden" : "",
            )}
          />
          EN
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
