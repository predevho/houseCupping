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
      className="text-xs text-red-500 font-semibold"
    >
      {isPending ? '삭제 중...' : '삭제'}
    </button>
  )
}
