import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'
import ThemeToggle from './ThemeToggle'

export default async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const username = user?.user_metadata?.username ?? '프로필'

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/95" role="banner">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold tracking-[0.02em] text-slate-950 shadow-sm transition-all duration-150 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B2635]/30 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:border-slate-500 dark:hover:bg-slate-700 dark:focus-visible:ring-[#A43348]/40"
        >
          <span className="sr-only">☕ House Cupping</span>
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-sm text-white dark:bg-slate-700"
          >
            ☕
          </span>
          <span aria-hidden="true">House Cupping</span>
        </Link>

        <nav aria-label="주요 메뉴" className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {user ? (
            <>
              <Link
                href="/profile"
                className="cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-150 hover:border-slate-400 hover:bg-white hover:text-slate-950 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B2635]/30 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-700 dark:hover:text-white dark:focus-visible:ring-[#A43348]/40"
              >
                {username}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-150 hover:bg-slate-200 hover:text-slate-950 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B2635]/30 active:scale-[0.98] dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white dark:focus-visible:ring-[#A43348]/40"
              >
                로그인
              </Link>
              <Link
                href="/auth"
                className="cursor-pointer rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-slate-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B2635]/30 active:scale-[0.98] dark:bg-slate-700 dark:hover:bg-slate-600 dark:focus-visible:ring-[#A43348]/40"
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
