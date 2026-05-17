'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ITEMS = [
  { href: '/', label: '홈' },
  { href: '/beans', label: '원두' },
  { href: '/cupping', label: '커핑 노트' },
]

function isActive(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/'
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function SideNav() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-[220px] shrink-0 lg:block">
      <nav
        aria-label="주요 카테고리"
        className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <ul className="flex flex-col gap-1">
          {ITEMS.map((item) => {
            const active = isActive(pathname, item.href)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'flex items-center rounded-2xl border-l-2 border-transparent px-4 py-3 text-sm font-medium transition-colors',
                    active
                      ? 'border-slate-900 bg-slate-100 text-slate-950 dark:border-slate-400 dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
                  ].join(' ')}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
