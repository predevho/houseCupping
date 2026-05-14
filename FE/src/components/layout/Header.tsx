import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'

export default async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const username = user?.user_metadata?.username ?? '프로필'

  return (
    <header>
      <Link href="/">☕ House Cupping</Link>
      <nav>
        <Link href="/profile">{username}</Link>
        <LogoutButton />
      </nav>
    </header>
  )
}
