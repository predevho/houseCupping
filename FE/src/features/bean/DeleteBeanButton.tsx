'use client'

import { useTransition } from 'react'
import { deleteBeanAction } from './actions'

interface Props {
  beanId: string
}

export default function DeleteBeanButton({ beanId }: Props) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => deleteBeanAction(beanId))}
      className="text-xs text-red-500 font-semibold"
    >
      {isPending ? '삭제 중...' : '삭제'}
    </button>
  )
}
