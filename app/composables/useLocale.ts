const translations = {
  de: {
    edit: 'Bearbeiten',
    done: 'Fertig',
    logout: 'Abmelden',
    addTab: 'Tab hinzufügen',
    addTabPlaceholder: 'Tab-Name',
    add: 'Hinzufügen',
    cancel: 'Abbrechen',
    addWidget: '+ Widget hinzufügen',
    noWidgets: 'Noch keine Widgets. Klicke auf Bearbeiten.',
    gridCols: 'Spalten',
    gridRows: 'Zeilen',
    settings: 'Einstellungen',
    tokens: 'Tokens',
    language: 'Sprache',
    backToDashboard: '← Dashboard',
  },
  en: {
    edit: 'Edit',
    done: 'Done',
    logout: 'Logout',
    addTab: 'Add tab',
    addTabPlaceholder: 'Tab name',
    add: 'Add',
    cancel: 'Cancel',
    addWidget: '+ Add widget',
    noWidgets: 'No widgets yet. Click Edit to add some.',
    gridCols: 'Columns',
    gridRows: 'Rows',
    settings: 'Settings',
    tokens: 'Tokens',
    language: 'Language',
    backToDashboard: '← Dashboard',
  },
} as const

type Locale = keyof typeof translations
type TranslationKey = keyof typeof translations.de

const _locale = useState<Locale>('locale', () => 'de')

export function useLocale() {
  if (import.meta.client && !_locale.value) {
    const saved = localStorage.getItem('locale') as Locale | null
    if (saved && saved in translations) _locale.value = saved
  }

  function t(key: TranslationKey): string {
    return translations[_locale.value][key]
  }

  function setLocale(locale: Locale) {
    _locale.value = locale
    if (import.meta.client) localStorage.setItem('locale', locale)
  }

  return { locale: readonly(_locale), t, setLocale, locales: Object.keys(translations) as Locale[] }
}
