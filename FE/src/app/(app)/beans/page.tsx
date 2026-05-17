import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import BeanSearch from '@/features/bean/BeanSearch'
import type { Database } from '@/types/database'

type Bean = Pick<Database['public']['Tables']['beans']['Row'], 'id' | 'bean_name' | 'cafe_name' | 'origin'>

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function BeansPage({ searchParams }: Props) {
  const { q: rawQ } = await searchParams
  const q = rawQ?.slice(0, 100)
  const supabase = await createClient()

  let query = supabase
    .from('beans')
    .select('id, bean_name, cafe_name, origin')
    .order('created_at', { ascending: false })

  if (q) {
    const safe = q.replace(/[,()]/g, '')
    query = query.or(`bean_name.ilike.%${safe}%,cafe_name.ilike.%${safe}%`)
  }

  const { data, error } = await query
  if (error) {
    console.error('beans query error:', error)
    throw new Error('원두 목록을 불러오는 데 실패했어요')
  }
  const beans = data as Bean[]

  return (
    <main className="max-w-md mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">원두 목록</h1>
        <Link href="/beans/new" className="text-xs text-[#8B2635] font-semibold">
          + 원두 등록
        </Link>
      </div>

      <BeanSearch q={q} />

      {beans.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {beans.map((bean) => (
            <li key={bean.id}>
              <Link
                href={`/beans/${bean.id}`}
                className="flex flex-col gap-0.5 border border-gray-100 rounded-lg px-4 py-3 hover:border-gray-300 transition-colors"
              >
                <span className="font-semibold text-sm">{bean.bean_name}</span>
                <span className="text-xs text-gray-500">{bean.cafe_name}</span>
                {bean.origin && (
                  <span className="text-xs text-gray-400">{bean.origin}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400">
          {q ? '검색 결과가 없어요' : '아직 등록된 원두가 없어요'}
        </p>
      )}
    </main>
  )
}
