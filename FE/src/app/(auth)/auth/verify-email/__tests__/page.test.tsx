import { render, screen } from '@testing-library/react'
import VerifyEmailPage from '../page'

describe('VerifyEmailPage', () => {
  it('이메일 확인 안내와 로그인 링크를 렌더링한다', async () => {
    render(await VerifyEmailPage({ searchParams: Promise.resolve({}) }))

    expect(screen.getByRole('heading', { name: '이메일을 확인해주세요' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '로그인으로 돌아가기' })).toHaveAttribute('href', '/auth')
  })
})
