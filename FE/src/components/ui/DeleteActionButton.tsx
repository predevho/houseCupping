'use client'

import { useTransition } from 'react'

interface Props {
  onDelete: () => Promise<void>
}

export default function DeleteActionButton({ onDelete }: Props) {
  const [isPending, startTransition] = useTransition()
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(onDelete)}
      className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 transition-all duration-150 hover:border-red-300 hover:bg-red-100 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-950/60 dark:bg-red-950/30 dark:text-red-300 dark:hover:border-red-900 dark:hover:bg-red-950/50 dark:focus-visible:ring-red-900/50"
    >
      {isPending ? '삭제 중...' : '삭제'}
    </button>
  )
}
