import { existsSync, mkdirSync, writeFileSync } from "fs"
import path from "path"

import source_de from "./lang/de.json"
import source_en from "./lang/en.json"

const sources = {
  de: source_de,
  en: source_en,
} as const

type SourcesType = keyof typeof sources

function generateTranslationFile(source: SourcesType) {
  const types = `export default ${JSON.stringify(
    sources[source],
    null,
    2,
  )} as const`

  const generatedPath = path.resolve("src/generated")

  if (!existsSync(generatedPath)) {
    mkdirSync(generatedPath)
  }

  writeFileSync(path.join(generatedPath, `${source}.ts`), types)
}

generateTranslationFile("de")
generateTranslationFile("en")
