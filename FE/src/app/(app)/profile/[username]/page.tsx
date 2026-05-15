import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

interface Props {
  params: Promise<{ username: string }>
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name, created_at')
    .eq('username', username)
    .maybeSingle()

  if (!profile) notFound()

  const joinedAt = new Date(profile.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main className="max-w-md mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-lg font-bold">@{profile.username}</p>
        <p className="text-gray-600">{profile.display_name}</p>
        <p className="text-xs text-gray-400">가입일 {joinedAt}</p>
      </div>
    </main>
  )
}
