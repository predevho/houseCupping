'use client'

import { useState } from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

type Tab = 'login' | 'signup'

export default function AuthTabs() {
  const [tab, setTab] = useState<Tab>('login')

  return (
    <div className="flex-1 bg-white flex flex-col justify-center px-10 py-12">
      <div className="flex border-b border-gray-100 mb-7">
        <button
          type="button"
          onClick={() => setTab('login')}
          className={`flex-1 pb-3 text-sm font-semibold transition-colors cursor-pointer ${
            tab === 'login'
              ? 'text-[#8B2635] border-b-2 border-[#8B2635]'
              : 'text-gray-300'
          }`}
        >
          로그인
        </button>
        <button
          type="button"
          onClick={() => setTab('signup')}
          className={`flex-1 pb-3 text-sm font-semibold transition-colors cursor-pointer ${
            tab === 'signup'
              ? 'text-[#8B2635] border-b-2 border-[#8B2635]'
              : 'text-gray-300'
          }`}
        >
          회원가입
        </button>
      </div>

      {tab === 'login' ? <LoginForm /> : <SignupForm />}
    </div>
  )
}
