import { composeMiddleware } from "~/middlewares/compose-middleware"
import { handleI18n } from "~/middlewares/i18n"

export default composeMiddleware([handleI18n])

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
}
