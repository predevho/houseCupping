import { render, screen, fireEvent } from '@testing-library/react'
import AuthTabs from '../AuthTabs'

jest.mock('../LoginForm', () => function MockLoginForm({ next }: { next?: string }) {
  return <div data-testid="login-form">{next ?? 'no-next'}</div>
})
jest.mock('../SignupForm', () => function MockSignupForm({ next }: { next?: string }) {
  return <div data-testid="signup-form">{next ?? 'no-next'}</div>
})

describe('AuthTabs', () => {
  it('초기 상태에서 로그인 폼을 표시한다', () => {
    render(<AuthTabs />)
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
    expect(screen.queryByTestId('signup-form')).not.toBeInTheDocument()
  })

  it('로그인 탭에 next를 전달한다', () => {
    render(<AuthTabs next="/cupping/12" />)
    expect(screen.getByTestId('login-form')).toHaveTextContent('/cupping/12')
  })

  it('회원가입 탭 클릭 시 회원가입 폼을 표시한다', () => {
    render(<AuthTabs />)
    fireEvent.click(screen.getByRole('button', { name: '회원가입' }))
    expect(screen.getByTestId('signup-form')).toBeInTheDocument()
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument()
  })

  it('회원가입 탭에도 next를 전달한다', () => {
    render(<AuthTabs next="/cupping/12" />)
    fireEvent.click(screen.getByRole('button', { name: '회원가입' }))
    expect(screen.getByTestId('signup-form')).toHaveTextContent('/cupping/12')
  })

  it('로그인 탭 클릭 시 로그인 폼으로 돌아온다', () => {
    render(<AuthTabs />)
    fireEvent.click(screen.getByRole('button', { name: '회원가입' }))
    fireEvent.click(screen.getByRole('button', { name: '로그인' }))
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
  })
})
