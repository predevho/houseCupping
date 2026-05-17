import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CuppingFeedList, { type CuppingFeedItem } from '@/features/cupping/CuppingFeedList'

export default async function HomePage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cupping_notes')
    .select(
      'id, aroma, acidity, body, roast_date, memo, created_at, profiles(username, display_name), beans(id, bean_name, cafe_name), likes(count), comments(count)'
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error('home feed query error:', error)
    throw new Error('홈 피드를 불러오는 데 실패했어요')
  }

  const notes = (data ?? []) as CuppingFeedItem[]

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-4 py-8">
      <section className="flex flex-col gap-2 rounded-2xl bg-[#f7f1eb] px-5 py-6 dark:bg-[#2a211d]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8B2635]">
          Public Feed
        </p>
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">최신 커핑 피드</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              회원이 아니어도 최근 기록을 둘러보고, 마음에 드는 노트는 상세 페이지에서 이어서 볼 수 있어요.
            </p>
          </div>
          <Link
            href="/cupping"
            className="shrink-0 cursor-pointer rounded-full px-3 py-2 text-sm font-semibold text-[#8B2635] transition-all duration-150 hover:bg-[#8B2635]/10 hover:text-[#6F1D2A] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B2635]/30 active:scale-[0.98] dark:focus-visible:ring-[#A43348]/40"
          >
            필터해서 보기
          </Link>
        </div>
      </section>

      <CuppingFeedList
        notes={notes}
        emptyMessage="아직 등록된 커핑 노트가 없어요"
      />
    </main>
  )
}
