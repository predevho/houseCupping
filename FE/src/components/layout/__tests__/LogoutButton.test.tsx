import { render, screen } from '@testing-library/react'
import LogoutButton from '../LogoutButton'

jest.mock('@/app/(app)/_actions/logout', () => ({
  logoutAction: jest.fn(),
}))

describe('LogoutButton', () => {
  it('로그아웃 버튼을 렌더링한다', () => {
    render(<LogoutButton />)
    expect(screen.getByRole('button', { name: '로그아웃' })).toBeInTheDocument()
  })

  it('버튼이 form 안에 있다', () => {
    render(<LogoutButton />)
    const button = screen.getByRole('button', { name: '로그아웃' })
    expect(button.closest('form')).toBeInTheDocument()
  })

  it('상단 nav에 맞는 pill 스타일 버튼을 사용한다', () => {
    render(<LogoutButton />)
    expect(screen.getByRole('button', { name: '로그아웃' })).toHaveClass(
      'rounded-full',
      'px-4',
      'py-2',
      'text-sm',
      'font-medium'
    )
  })

  it('호버 시 배경과 글자색이 즉각적으로 변한다', () => {
    render(<LogoutButton />)
    expect(screen.getByRole('button', { name: '로그아웃' })).toHaveClass(
      'hover:bg-slate-200',
      'hover:text-slate-950',
      'dark:hover:bg-slate-700'
    )
  })

  it('active와 focus-visible 상태를 사용한다', () => {
    render(<LogoutButton />)
    expect(screen.getByRole('button', { name: '로그아웃' })).toHaveClass(
      'active:scale-[0.98]',
      'focus-visible:ring-2'
    )
  })
})
