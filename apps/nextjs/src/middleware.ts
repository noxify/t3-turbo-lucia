//import { withAuth } from "~/middlewares/auth"
import { chainMiddleware } from "~/middlewares/chain-middleware"
import { withI18n } from "~/middlewares/i18n"

/**
 * The auth middleware is disabled and provides more a way
 * of "How could it be" - Based on https://pilcrowonpaper.com/blog/middleware-auth/
 * you should think about "how to secure your pages"
 *
 * This example is based on a "node environment" and requires
 * an internal api endpoint to check the session
 */
export default chainMiddleware([withI18n /*withAuth*/])

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
}
