'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function logoutAction() {
  const supabase = await createClient()
  try {
    await supabase.auth.signOut()
  } catch {
    // signOut 실패해도 /auth로 이동
  }
  redirect('/auth')
}
