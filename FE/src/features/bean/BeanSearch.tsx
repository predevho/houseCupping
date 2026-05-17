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
        className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8B2635]"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-[#8B2635] text-white text-sm rounded"
      >
        검색
      </button>
    </form>
  )
}
