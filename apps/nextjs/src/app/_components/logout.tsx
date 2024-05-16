"use client"

import { Button } from "@acme/ui/button"

import { logoutAction } from "~/actions/logout"

export function Logout() {
  return (
    <form action={logoutAction}>
      <Button variant="outline" type="submit">
        Sign out
      </Button>
    </form>
  )
}
