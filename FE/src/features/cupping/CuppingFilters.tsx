'use client'

interface BeanOption {
  id: number
  label: string
}

interface Props {
  beanOptions: BeanOption[]
  beanId?: string
  sort?: string
}

export default function CuppingFilters({ beanOptions, beanId, sort }: Props) {
  return (
    <form method="GET" action="/cupping" className="flex gap-2">
      <div className="flex-1">
        <label htmlFor="beanId" className="sr-only">원두 필터</label>
        <select
          id="beanId"
          name="beanId"
          defaultValue={beanId ?? ''}
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="">전체 원두</option>
          {beanOptions.map((bean) => (
            <option key={bean.id} value={bean.id}>
              {bean.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="sort" className="sr-only">정렬</label>
        <select
          id="sort"
          name="sort"
          defaultValue={sort ?? 'latest'}
          className="border border-gray-200 rounded px-3 py-2 text-sm bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
        </select>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-[#8B2635] text-white text-sm rounded"
      >
        적용
      </button>
    </form>
  )
}
