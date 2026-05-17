import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AuthTabs from './AuthTabs'

interface Props {
  searchParams: Promise<{ next?: string }>
}

export default async function AuthPage({ searchParams }: Props) {
  const { next } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/')

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-3xl flex shadow-lg rounded-xl overflow-hidden h-[640px]">
        {/* 왼쪽 브랜딩 패널 */}
        <div
          className="w-[45%] flex flex-col items-center justify-center gap-4 px-10"
          style={{ background: 'linear-gradient(145deg, #8B2635, #4A7C40)' }}
        >
          <span className="text-6xl">☕</span>
          <span className="text-white text-xl font-bold tracking-[0.2em]">
            HOUSE CUPPING
          </span>
          <div className="w-10 h-px bg-white/40" />
          <span className="text-white/60 text-xs tracking-[0.15em]">
            TASTE · RECORD · SHARE
          </span>
        </div>

        {/* 오른쪽 폼 영역 */}
        <AuthTabs next={next} />
      </div>
    </div>
  )
}
