'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type LoginState = { error?: string } | null

export type SignupState = {
  errors?: {
    username?: string
    email?: string
    general?: string
  }
} | null

export async function loginAction(
  _state: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return { error: '아이디와 비밀번호를 입력해주세요' }
  }

  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('email')
    .eq('username', username)
    .single()

  if (!profile?.email) {
    return { error: '아이디 또는 비밀번호가 올바르지 않습니다' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: profile.email,
    password,
  })

  if (error) {
    return { error: '아이디 또는 비밀번호가 올바르지 않습니다' }
  }

  redirect('/')
}

export async function signupAction(
  _state: SignupState,
  formData: FormData
): Promise<SignupState> {
  const username = formData.get('username') as string
  const display_name = formData.get('display_name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!username || !display_name || !email || !password) {
    return { errors: { general: '모든 필드를 입력해주세요' } }
  }

  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (existing) {
    return { errors: { username: '이미 사용 중인 아이디입니다' } }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username, display_name } },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { errors: { email: '이미 가입된 이메일입니다' } }
    }
    return { errors: { general: '잠시 후 다시 시도해주세요' } }
  }

  redirect('/')
}
