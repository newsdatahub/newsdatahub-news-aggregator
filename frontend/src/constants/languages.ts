/**
 * Language list for filtering
 */

export interface Language {
  code: string;
  name: string;
  popular?: boolean;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', popular: true },
  { code: 'es', name: 'Español', popular: true },
  { code: 'fr', name: 'Français', popular: true },
  { code: 'de', name: 'Deutsch', popular: true },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'ru', name: 'Русский' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
  { code: 'ar', name: 'العربية' },
  { code: 'ko', name: '한국어' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'sv', name: 'Svenska' },
  { code: 'no', name: 'Norsk' },
  { code: 'da', name: 'Dansk' },
  { code: 'fi', name: 'Suomi' },
];
