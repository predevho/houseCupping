import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CuppingFilters from '@/features/cupping/CuppingFilters'
import CuppingFeedList, { type CuppingFeedItem } from '@/features/cupping/CuppingFeedList'

interface Props {
  searchParams: Promise<{ beanId?: string; sort?: string }>
}

interface BeanOption {
  id: number
  bean_name: string
  cafe_name: string
}

export default async function CuppingListPage({ searchParams }: Props) {
  const { beanId, sort: rawSort } = await searchParams
  const sort = rawSort === 'oldest' ? 'oldest' : 'latest'
  const supabase = await createClient()

  let notesQuery = supabase
    .from('cupping_notes')
    .select(
      'id, bean_id, aroma, acidity, body, roast_date, memo, created_at, profiles(username, display_name), beans(id, bean_name, cafe_name), likes(count), comments(count)'
    )
    .order('created_at', { ascending: sort === 'oldest' })

  if (beanId) {
    notesQuery = notesQuery.eq('bean_id', Number(beanId))
  }

  const [{ data: notesData, error: notesError }, { data: beansData, error: beansError }] =
    await Promise.all([
      notesQuery,
      supabase.from('beans').select('id, bean_name, cafe_name').order('created_at', { ascending: false }),
    ])

  if (notesError) {
    console.error('cupping_notes list query error:', notesError)
    throw new Error('커핑 노트 목록을 불러오는 데 실패했어요')
  }

  if (beansError) {
    console.error('beans filter query error:', beansError)
    throw new Error('원두 필터를 불러오는 데 실패했어요')
  }

  const notes = (notesData ?? []) as CuppingFeedItem[]
  const beanOptions = (beansData ?? []).map((bean: BeanOption) => ({
    id: bean.id,
    label: `${bean.cafe_name} - ${bean.bean_name}`,
  }))

  return (
    <main className="max-w-md mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">커핑 노트 목록</h1>
        <Link
          href="/beans"
          className="cursor-pointer rounded-full px-3 py-2 text-xs font-semibold text-[#8B2635] transition-all duration-150 hover:bg-[#8B2635]/10 hover:text-[#6F1D2A] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B2635]/30 active:scale-[0.98] dark:focus-visible:ring-[#A43348]/40"
        >
          원두 보러가기
        </Link>
      </div>

      <CuppingFilters beanOptions={beanOptions} beanId={beanId} sort={sort} />

      <CuppingFeedList
        notes={notes}
        emptyMessage={
          beanId ? '선택한 원두의 커핑 노트가 아직 없어요' : '아직 등록된 커핑 노트가 없어요'
        }
      />
    </main>
  )
}
