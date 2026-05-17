'use client'

import { useEffect } from 'react'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AppError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="max-w-md mx-auto px-4 py-16 flex flex-col items-center text-center gap-3">
      <h1 className="text-lg font-bold">문제가 발생했어요</h1>
      <p className="text-sm text-gray-500">
        잠시 후 다시 시도하거나 아래 버튼으로 다시 불러와 주세요.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 px-4 py-2 bg-[#8B2635] text-white text-sm rounded"
      >
        다시 시도
      </button>
    </main>
  )
}
