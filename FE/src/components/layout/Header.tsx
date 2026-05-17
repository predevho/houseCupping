import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'

export default async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const username = user?.user_metadata?.username ?? '프로필'

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur" role="banner">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold tracking-[0.02em] text-slate-950 shadow-sm transition-colors hover:border-slate-300"
        >
          <span className="sr-only">☕ House Cupping</span>
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-sm text-white"
          >
            ☕
          </span>
          <span aria-hidden="true">House Cupping</span>
        </Link>

        <nav aria-label="주요 메뉴" className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <Link
                href="/profile"
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-white hover:text-slate-950"
              >
                {username}
              </Link>
              <div className="shrink-0 rounded-full border border-slate-200 bg-white px-1 py-1 shadow-sm">
                <LogoutButton />
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
              >
                로그인
              </Link>
              <Link
                href="/auth"
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
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
