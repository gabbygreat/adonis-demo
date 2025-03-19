import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const localesPath = path.join(__dirname, '../resources/locales/en.arb') // Default locale
const typesDir = path.join(__dirname, '../app/types') // Ensure the directory exists
const outputPath = path.join(typesDir, 'locales.d.ts')

// ✅ Create the directory if it doesn't exist
if (!fs.existsSync(typesDir)) {
  fs.mkdirSync(typesDir, { recursive: true })
}

const translations = JSON.parse(fs.readFileSync(localesPath, 'utf8'))
const keys = Object.keys(translations)

const typeDef = `export type TranslationKeys =\n  | "${keys.join('"\n  | "')}"\n`
fs.writeFileSync(outputPath, typeDef, 'utf8')

console.log('✅ Translation keys generated successfully!')
