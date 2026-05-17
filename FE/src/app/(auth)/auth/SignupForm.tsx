'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { signupAction, type SignupState } from './actions'

const fieldClass = (hasError: boolean) =>
  `w-full h-10 px-3 bg-gray-50 border rounded-md text-sm outline-none transition-all
   focus:border-[#8B2635] focus:ring-2 focus:ring-[#8B2635]/15
   dark:bg-gray-800 dark:text-gray-100
   ${hasError ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'}`

const labelWrapClass = 'flex items-center gap-0.5 mb-1.5'
const labelClass = 'text-xs font-semibold text-gray-500 dark:text-gray-400'

interface Props {
  next?: string
}

export default function SignupForm({ next }: Props) {
  const [state, action, isPending] = useActionState<SignupState, FormData>(
    signupAction,
    null
  )
  const [passwordMismatch, setPasswordMismatch] = useState(false)

  const usernameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const passwordConfirmRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!state?.errors) return
    if (state.errors.username) usernameRef.current?.focus()
    else if (state.errors.email) emailRef.current?.focus()
  }, [state])

  // fireEvent.click in JSDOM + React 19 form actions does not trigger onSubmit,
  // so this click handler provides the client-side mismatch check for test compat.
  function handleButtonClick() {
    const pw = passwordRef.current?.value ?? ''
    const confirm = passwordConfirmRef.current?.value ?? ''
    if (pw !== confirm) {
      setPasswordMismatch(true)
      passwordConfirmRef.current?.focus()
    } else {
      setPasswordMismatch(false)
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    const confirm = (form.elements.namedItem('passwordConfirm') as HTMLInputElement).value

    if (password !== confirm) {
      e.preventDefault()
      setPasswordMismatch(true)
      passwordConfirmRef.current?.focus()
      return
    }

    setPasswordMismatch(false)
  }

  return (
    <form action={action} onSubmit={handleSubmit} className="flex flex-col gap-3">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      {/* 아이디 */}
      <div>
        <div className={labelWrapClass}>
          <label htmlFor="username" className={labelClass}>아이디</label>
          <span className="text-red-500 text-xs" aria-hidden="true">*</span>
        </div>
        <input
          ref={usernameRef}
          id="username"
          name="username"
          type="text"
          required
          className={fieldClass(!!state?.errors?.username)}
        />
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">영문, 숫자, _, - 만 사용 (4~16자)</p>
        {state?.errors?.username && (
          <p role="alert" className="text-[10px] text-red-600 mt-1">
            <span aria-hidden>⚠</span> {state.errors.username}
          </p>
        )}
      </div>

      {/* 닉네임 */}
      <div>
        <div className={labelWrapClass}>
          <label htmlFor="display_name" className={labelClass}>닉네임</label>
          <span className="text-red-500 text-xs" aria-hidden="true">*</span>
        </div>
        <input
          id="display_name"
          name="display_name"
          type="text"
          required
          className={fieldClass(false)}
        />
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">4~12자</p>
      </div>

      {/* 이메일 */}
      <div>
        <div className={labelWrapClass}>
          <label htmlFor="email" className={labelClass}>이메일</label>
          <span className="text-red-500 text-xs" aria-hidden="true">*</span>
        </div>
        <input
          ref={emailRef}
          id="email"
          name="email"
          type="email"
          required
          className={fieldClass(!!state?.errors?.email)}
        />
        {state?.errors?.email && (
          <p role="alert" className="text-[10px] text-red-600 mt-1">
            <span aria-hidden>⚠</span> {state.errors.email}
          </p>
        )}
      </div>

      {/* 비밀번호 */}
      <div>
        <div className={labelWrapClass}>
          <label htmlFor="password" className={labelClass}>비밀번호</label>
          <span className="text-red-500 text-xs" aria-hidden="true">*</span>
        </div>
        <input
          ref={passwordRef}
          id="password"
          name="password"
          type="password"
          required
          className={fieldClass(false)}
        />
      </div>

      {/* 비밀번호 확인 */}
      <div>
        <div className={labelWrapClass}>
          <label htmlFor="passwordConfirm" className={labelClass}>비밀번호 확인</label>
          <span className="text-red-500 text-xs" aria-hidden="true">*</span>
        </div>
        <input
          ref={passwordConfirmRef}
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          required
          className={fieldClass(passwordMismatch)}
        />
        {passwordMismatch && (
          <p role="alert" className="text-[10px] text-red-600 mt-1">
            <span aria-hidden>⚠</span> 비밀번호가 일치하지 않습니다
          </p>
        )}
      </div>

      {state?.errors?.general && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded-md px-3 py-2 text-xs text-red-600 flex items-center gap-1.5 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400">
          <span aria-hidden>⚠</span> {state.errors.general}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        onClick={handleButtonClick}
        className="h-10 bg-[#8B2635] text-white text-sm font-semibold rounded-md mt-1
          hover:bg-[#7A2030] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? '가입 중...' : '가입하기'}
      </button>
    </form>
  )
}
