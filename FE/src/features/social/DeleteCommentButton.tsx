'use client'

import { useTransition } from 'react'
import { deleteCommentAction } from './actions'

interface Props {
  commentId: string
  noteId: string
}

export default function DeleteCommentButton({ commentId, noteId }: Props) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => deleteCommentAction(commentId, noteId))}
      className="text-xs text-red-500 font-semibold"
    >
      {isPending ? '삭제 중...' : '삭제'}
    </button>
  )
}
