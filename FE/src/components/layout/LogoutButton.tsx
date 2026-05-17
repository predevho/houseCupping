'use client'

import { logoutAction } from '@/app/(app)/_actions/logout'

export default function LogoutButton() {
  return (
    <form action={logoutAction} className="shrink-0">
      <button
        type="submit"
        className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all duration-150 hover:bg-slate-200 hover:text-slate-950 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B2635]/30 active:scale-[0.98] dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white dark:focus-visible:ring-[#A43348]/40"
      >
        로그아웃
      </button>
    </form>
  )
}
