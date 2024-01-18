"use server"

import { redirect } from "next/navigation"

import { auth, lucia } from "@acme/auth"

export async function invalivateSessionAction(sessionId: string) {
  const session = await auth()
  if (!session.user) {
    return {
      error: "Unauthorized",
    }
  }

  const userSessions = await lucia.getUserSessions(session.user.id)

  if (userSessions.find((ele) => ele.id === sessionId)) {
    await lucia.invalidateSession(sessionId)
  }
}

interface ActionResult {
  error: string | null
}
