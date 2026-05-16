'use client'

import { useTransition } from 'react'
import { deleteCuppingAction } from './actions'

interface Props {
  noteId: string
  beanId: string
}

export default function DeleteButton({ noteId, beanId }: Props) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => deleteCuppingAction(noteId, beanId))}
      className="text-xs text-red-500 font-semibold"
    >
      {isPending ? '삭제 중...' : '삭제'}
    </button>
  )
}
