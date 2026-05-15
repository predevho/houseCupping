'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type UpdateProfileState = {
  errors?: {
    username?: string
    display_name?: string
    general?: string
  }
} | null

export async function updateProfileAction(
  _state: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const username = formData.get('username') as string
  const display_name = formData.get('display_name') as string

  if (!username || !display_name) {
    return { errors: { general: '모든 필드를 입력해주세요' } }
  }

  if (!/^[a-zA-Z0-9_-]{4,16}$/.test(username)) {
    return { errors: { username: '4~16자, 영문/숫자/_/- 만 사용 가능합니다' } }
  }

  if (display_name.length < 4 || display_name.length > 12) {
    return { errors: { display_name: '4~12자로 입력해주세요' } }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { errors: { general: '로그인이 필요합니다' } }
  }

  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .neq('id', user.id)
    .single()

  if (existing) {
    return { errors: { username: '이미 사용 중인 아이디입니다' } }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ username, display_name })
    .eq('id', user.id)

  if (error) {
    return { errors: { general: '잠시 후 다시 시도해주세요' } }
  }

  revalidatePath('/profile')
  return null
}
