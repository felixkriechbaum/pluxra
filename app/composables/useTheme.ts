export type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
  const theme = useState<Theme>('theme', () => 'system')

  function applyTheme(t: Theme) {
    if (!import.meta.client) return
    const dark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', dark)
  }

  function setTheme(t: Theme) {
    theme.value = t
    localStorage.setItem('theme', t)
    applyTheme(t)
  }

  function initTheme() {
    if (!import.meta.client) return
    const saved = (localStorage.getItem('theme') as Theme | null) ?? 'system'
    theme.value = saved
    applyTheme(saved)
    if (saved === 'system') {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => applyTheme('system'))
    }
  }

  return { theme: readonly(theme), setTheme, initTheme }
}
