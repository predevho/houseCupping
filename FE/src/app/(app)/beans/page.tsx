import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import BeanSearch from '@/features/bean/BeanSearch'
import type { Database } from '@/types/database'

type BeanWithImage = Pick<Database['public']['Tables']['beans']['Row'], 'id' | 'bean_name' | 'cafe_name' | 'origin' | 'image_path'>
type BeanWithoutImage = Pick<Database['public']['Tables']['beans']['Row'], 'id' | 'bean_name' | 'cafe_name' | 'origin'>

interface Props {
  searchParams: Promise<{ q?: string }>
}

function isMissingImagePathColumn(error: { code?: string; message?: string } | null) {
  return error?.code === 'PGRST204' || error?.message?.includes('image_path')
}

export default async function BeansPage({ searchParams }: Props) {
  const { q: rawQ } = await searchParams
  const q = rawQ?.slice(0, 100)
  const supabase = await createClient()
  const safe = q?.replace(/[,()]/g, '')

  let query = supabase
    .from('beans')
    .select('id, bean_name, cafe_name, origin, image_path')
    .order('created_at', { ascending: false })

  if (safe) {
    query = query.or(`bean_name.ilike.%${safe}%,cafe_name.ilike.%${safe}%`)
  }

  let { data, error } = await query

  if (isMissingImagePathColumn(error)) {
    let fallbackQuery = supabase
      .from('beans')
      .select('id, bean_name, cafe_name, origin')
      .order('created_at', { ascending: false })

    if (safe) {
      fallbackQuery = fallbackQuery.or(`bean_name.ilike.%${safe}%,cafe_name.ilike.%${safe}%`)
    }

    const fallbackResult = await fallbackQuery

    data = (fallbackResult.data ?? []).map((bean: BeanWithoutImage) => ({
      ...bean,
      image_path: null,
    }))
    error = fallbackResult.error
  }

  if (error) {
    console.error('beans query error:', error)
    throw new Error('원두 목록을 불러오는 데 실패했어요')
  }

  const beans = data as BeanWithImage[]

  return (
    <main className="max-w-md mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">원두 목록</h1>
        <Link
          href="/beans/new"
          className="cursor-pointer rounded-full px-3 py-2 text-xs font-semibold text-[#8B2635] transition-all duration-150 hover:bg-[#8B2635]/10 hover:text-[#6F1D2A] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B2635]/30 active:scale-[0.98] dark:focus-visible:ring-[#A43348]/40"
        >
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
                className="flex cursor-pointer gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3 transition-all duration-150 hover:border-[#8B2635]/30 hover:bg-[#8B2635]/[0.06] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B2635]/20 active:scale-[0.99] dark:border-gray-800 dark:bg-gray-900 dark:hover:border-[#A43348]/50 dark:hover:bg-[#A43348]/10 dark:focus-visible:ring-[#A43348]/30"
              >
                {bean.image_path ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={supabase.storage.from('beans').getPublicUrl(bean.image_path).data.publicUrl}
                    alt={`${bean.bean_name} 대표 이미지`}
                    className="w-16 h-16 rounded-md object-cover shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-md bg-gray-100 shrink-0" />
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold dark:text-gray-100">{bean.bean_name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-300">{bean.cafe_name}</span>
                  {bean.origin && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">{bean.origin}</span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-500">
          {q ? '검색 결과가 없어요' : '아직 등록된 원두가 없어요'}
        </p>
      )}
    </main>
  )
}
