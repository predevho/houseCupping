'use client'

import { logoutAction } from '@/app/(app)/_actions/logout'

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit">로그아웃</button>
    </form>
  )
}
