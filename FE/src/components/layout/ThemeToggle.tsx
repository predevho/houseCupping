'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'

const THEMES = [
  { value: 'light', label: '라이트', icon: '☀️' },
  { value: 'dark', label: '다크', icon: '🌙' },
  { value: 'system', label: '시스템', icon: '💻' },
] as const

type ThemeValue = (typeof THEMES)[number]['value']

function currentIcon(theme: string | undefined): string {
  return THEMES.find((t) => t.value === theme)?.icon ?? '💻'
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="테마 변경"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-base transition-colors hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600 dark:hover:bg-slate-700"
      >
        {currentIcon(theme)}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-32 rounded-lg border border-slate-200 bg-white py-1 shadow-md dark:border-slate-700 dark:bg-slate-900">
          {THEMES.map(({ value, label, icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setTheme(value as ThemeValue)
                setOpen(false)
              }}
              className={[
                'flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800',
                theme === value
                  ? 'font-semibold text-slate-950 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400',
              ].join(' ')}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
