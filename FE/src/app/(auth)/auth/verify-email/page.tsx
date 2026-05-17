import Link from 'next/link'

interface Props {
  searchParams: Promise<{ next?: string }>
}

function buildLoginHref(next?: string): string {
  if (!next) return '/auth'
  if (!next.startsWith('/') || next.startsWith('//')) return '/auth'

  return `/auth?next=${encodeURIComponent(next)}`
}

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { next } = await searchParams
  const loginHref = buildLoginHref(next)

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <section className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8B2635]">
          Verify Email
        </p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          이메일을 확인해주세요
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          회원가입은 완료됐어요. 메일함에서 인증 링크를 누른 뒤 로그인하면 계속 진행할 수 있어요.
        </p>
        <Link
          href={loginHref}
          className="inline-flex w-fit items-center rounded-full bg-[#8B2635] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#6F1D2A] hover:shadow-md dark:hover:bg-[#A43348]"
        >
          로그인으로 돌아가기
        </Link>
      </section>
    </main>
  )
}
