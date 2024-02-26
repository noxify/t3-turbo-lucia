import type { MiddlewareFunction } from "@/middlewares/compose-middleware"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const AUTH_EXCLUDE = ["/auth"]

export const handleAuth: MiddlewareFunction = async (request, next) => {
  const pathname = request.nextUrl.pathname
  const origin = request.nextUrl.origin
  if (AUTH_EXCLUDE.includes(pathname)) {
    return next()
  }

  // this is just an workaround to handle the auth verification
  // inside the middleware - Since the middleware is "edge only"
  // we have to call an internal api endpoint to run the lucia magic ;)
  const verifyRequest = await fetch(`${origin}/api/auth/verify-session`, {
    // without this, we can't check the cookie in the called api route
    headers: { Cookie: cookies().toString() },
  })

  const verifySession = (await verifyRequest.json()) as {
    valid: boolean
  }

  if (!verifySession.valid) {
    // invalid session
    return NextResponse.redirect(new URL("/auth", request.nextUrl))
  }

  // everything seems ok
  return next()
}
