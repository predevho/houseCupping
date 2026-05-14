'use client'

import { useActionState, useEffect, useRef } from 'react'
import { loginAction, type LoginState } from './actions'

const fieldClass = (hasError: boolean) =>
  `w-full h-10 px-3 bg-gray-50 border rounded-md text-sm outline-none transition-all
   focus:border-[#8B2635] focus:ring-2 focus:ring-[#8B2635]/15
   ${hasError ? 'border-red-300 bg-red-50' : 'border-gray-200'}`

export default function LoginForm() {
  const [state, action, isPending] = useActionState<LoginState, FormData>(
    loginAction,
    null
  )

  const usernameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state?.error) {
      usernameRef.current?.focus()
    }
  }, [state])

  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="username"
          className="block text-xs font-semibold text-gray-500 mb-1.5"
        >
          아이디
        </label>
        <input
          ref={usernameRef}
          id="username"
          name="username"
          type="text"
          required
          className={fieldClass(!!state?.error)}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs font-semibold text-gray-500 mb-1.5"
        >
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className={fieldClass(!!state?.error)}
        />
      </div>

      {state?.error && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded-md px-3 py-2 text-xs text-red-600 flex items-center gap-1.5">
          <span aria-hidden>⚠</span> {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="h-10 bg-[#8B2635] text-white text-sm font-semibold rounded-md mt-1
          hover:bg-[#7A2030] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? '로그인 중...' : '로그인'}
      </button>
    </form>
  )
}
