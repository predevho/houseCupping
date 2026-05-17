import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CuppingFilters from '@/features/cupping/CuppingFilters'

interface Props {
  searchParams: Promise<{ beanId?: string; sort?: string }>
}

interface BeanOption {
  id: number
  bean_name: string
  cafe_name: string
}

interface CuppingListItem {
  id: number
  bean_id: number
  aroma: number
  acidity: number
  body: number
  roast_date: string | null
  memo: string | null
  created_at: string
  profiles: { username: string; display_name: string | null } | null
  beans: { bean_name: string; cafe_name: string } | null
}

export default async function CuppingListPage({ searchParams }: Props) {
  const { beanId, sort: rawSort } = await searchParams
  const sort = rawSort === 'oldest' ? 'oldest' : 'latest'
  const supabase = await createClient()

  let notesQuery = supabase
    .from('cupping_notes')
    .select('id, bean_id, aroma, acidity, body, roast_date, memo, created_at, profiles(username, display_name), beans(bean_name, cafe_name)')
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

  const notes = (notesData ?? []) as CuppingListItem[]
  const beanOptions = (beansData ?? []).map((bean: BeanOption) => ({
    id: bean.id,
    label: `${bean.cafe_name} - ${bean.bean_name}`,
  }))

  return (
    <main className="max-w-md mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">커핑 노트 목록</h1>
        <Link href="/beans" className="text-xs text-[#8B2635] font-semibold">
          원두 보러가기
        </Link>
      </div>

      <CuppingFilters beanOptions={beanOptions} beanId={beanId} sort={sort} />

      {notes.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {notes.map((note) => (
            <li key={note.id}>
              <Link
                href={`/cupping/${note.id}`}
                className="flex flex-col gap-2 border border-gray-100 rounded-lg px-4 py-3 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {note.beans
                        ? `${note.beans.bean_name} - ${note.beans.cafe_name}`
                        : '알 수 없는 원두'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {note.profiles?.display_name ?? note.profiles?.username ?? '알 수 없음'} ·{' '}
                      {new Date(note.created_at).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 text-sm">
                  <span>향미 {note.aroma}</span>
                  <span>산미 {note.acidity}</span>
                  <span>바디 {note.body}</span>
                </div>

                {note.roast_date && (
                  <p className="text-xs text-gray-400">로스팅일 {note.roast_date}</p>
                )}

                {note.memo && (
                  <p className="text-sm text-gray-600 line-clamp-2">{note.memo}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400">
          {beanId ? '선택한 원두의 커핑 노트가 아직 없어요' : '아직 등록된 커핑 노트가 없어요'}
        </p>
      )}
    </main>
  )
}
