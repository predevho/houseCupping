'use client'

interface Props {
  q?: string
}

export default function BeanSearch({ q }: Props) {
  return (
    <form method="GET" action="/beans" className="flex gap-2">
      <input
        type="search"
        name="q"
        defaultValue={q ?? ''}
        placeholder="원두명 또는 카페명 검색"
        className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8B2635] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
      />
      <button
        type="submit"
        className="cursor-pointer rounded-md bg-[#8B2635] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#6F1D2A] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B2635]/30 active:scale-[0.98] dark:hover:bg-[#A43348] dark:focus-visible:ring-[#A43348]/40"
      >
        검색
      </button>
    </form>
  )
}
