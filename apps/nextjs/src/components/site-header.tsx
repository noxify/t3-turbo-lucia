import Link from "next/link"

import { ThemeToggle } from "@acme/ui/theme"

import { Logo } from "@/components/logo"
import { UserMenu } from "@/components/user-menu"

export function SiteHeader() {
  return (
    <header className=" sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container">
        <nav
          className="mx-auto flex items-center justify-between "
          aria-label="Global"
        >
          <Link href="/" className="-m-1.5 p-1.5">
            <Logo className="h-16" />
          </Link>

          <div className="flex gap-1">
            <UserMenu />
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}
