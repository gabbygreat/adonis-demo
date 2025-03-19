import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { TranslationKeys } from '../types/locales.js'

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class LocalizationService {
  private static translations: Record<string, any> = {}

  static loadTranslations(lang: string) {
    try {
      const filePath = path.join(__dirname, `../../resources/locales/${lang}.arb`)
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'))
      }
      return JSON.parse(
        fs.readFileSync(path.join(__dirname, '../../resources/locales/en.arb'), 'utf8')
      ) // Default to English
    } catch (error) {
      return {}
    }
  }

  static getMessage(lang: string, key: TranslationKeys) {
    if (!this.translations[lang]) {
      this.translations[lang] = this.loadTranslations(lang)
    }
    return this.translations[lang]?.[key] || key // Return key if not found
  }
}

export default LocalizationService
