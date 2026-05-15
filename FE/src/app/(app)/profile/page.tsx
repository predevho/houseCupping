import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditForm from '@/features/member/EditForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name, created_at')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth')

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

      <section>
        <h2 className="text-sm font-semibold text-gray-500 mb-3">프로필 수정</h2>
        <EditForm
          initialValues={{
            username: profile.username,
            display_name: profile.display_name,
          }}
        />
      </section>
    </main>
  )
}
