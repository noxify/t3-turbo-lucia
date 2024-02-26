/**
 * @source
 *  * https://github.com/whitecrownclown/merge-headers/blob/master/index.ts
 *  * https://github.com/vercel/next.js/discussions/53997#discussioncomment-8259481
 */
function isObject(value: unknown) {
  return value !== null && typeof value === "object"
}

export function mergeHeaders(...sources: HeadersInit[]) {
  const result: Record<string, string> = {}

  for (const source of sources) {
    if (!isObject(source)) {
      throw new TypeError("All arguments must be of type object")
    }

    const headers: Headers = new Headers(source)

    for (const [key, value] of Array.from(headers.entries())) {
      if (value === undefined || value === "undefined") {
        delete result[key]
      } else {
        result[key] = value
      }
    }
  }

  return new Headers(result)
}
