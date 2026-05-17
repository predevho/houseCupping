'use client'

import { logoutAction } from '@/app/(app)/_actions/logout'

export default function LogoutButton() {
  return (
    <form action={logoutAction} className="shrink-0">
      <button
        type="submit"
        className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        로그아웃
      </button>
    </form>
  )
}
