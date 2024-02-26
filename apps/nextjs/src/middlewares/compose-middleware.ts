// @source https://github.com/vercel/next.js/discussions/53997#discussioncomment-8259481
import type { NextFetchEvent, NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { mergeHeaders } from "@/middlewares/merge-headers"

type GoNextMiddleware = () => "continue"

export type MiddlewareFunction = (
  request: NextRequest,
  next: GoNextMiddleware,
  event: NextFetchEvent,
) => Promise<NextResponse<unknown> | ReturnType<GoNextMiddleware>>

export function composeMiddleware(handlers: MiddlewareFunction[] = []) {
  const validMiddlewareHandlers = handlers.filter(
    (handler) => typeof handler === "function",
  )

  return async function (request: NextRequest, event: NextFetchEvent) {
    const allResponses: NextResponse[] = []

    // 1.
    // run every middleware and collect responses (NextResponse)
    // until a middleware want to break the chain (redirect or rewrite)
    for (const fn of validMiddlewareHandlers) {
      const result = await fn(request, () => "continue", event)

      // ensure that fn returned  something or notify the dev
      if (result !== "continue" && !(result instanceof NextResponse)) {
        console.error(
          `The middleware chain has been broken because '${fn.name}' did not return a NextResponse or call next().`,
        )
        return NextResponse.next()
      }

      // go next middleware
      if (result === "continue") continue

      // we have a response
      allResponses.push(result)

      // the "middleware" function cannot return a native Response
      // @see https://nextjs.org/docs/messages/middleware-upgrade-guide#no-response-body
      // It can only :
      //   - return `NextResponse.redirect() or NextResponse.rewrite()`
      //        => this must break the chian
      //   - return a mutated request using `NextResponse.next({ request: { /* ... */ }})`
      //        => this must NOT break the chain
      const isRedirect = () => result.headers.get("Location")
      const isRewrite = () => result.headers.get("x-middleware-rewrite")
      if (isRedirect() ?? isRewrite()) {
        // break the chain
        break
      }
    }

    // 2.
    // return final response

    // miiddlewares have not returned any response, do nothing...
    if (allResponses.length === 0) return NextResponse.next()

    // only one middleware returned a response, return it
    if (allResponses.length === 1) return allResponses[0]

    // more than one middleware returned a response
    // merge headers into a final response and return it
    const finalResponse = allResponses[allResponses.length - 1]!
    const finalHeaders: Headers = mergeHeaders(
      ...allResponses.map((r) => r.headers),
    )
    for (const [key] of Array.from(finalResponse.headers.entries())) {
      finalResponse.headers.delete(key)
    }
    for (const [key, value] of Array.from(finalHeaders.entries())) {
      finalResponse.headers.set(key, value)
    }
    return finalResponse
  }
}
