import { render, screen, fireEvent } from '@testing-library/react'
import AuthTabs from '../AuthTabs'

jest.mock('../LoginForm', () => () => <div data-testid="login-form" />)
jest.mock('../SignupForm', () => () => <div data-testid="signup-form" />)

describe('AuthTabs', () => {
  it('초기 상태에서 로그인 폼을 표시한다', () => {
    render(<AuthTabs />)
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
    expect(screen.queryByTestId('signup-form')).not.toBeInTheDocument()
  })

  it('회원가입 탭 클릭 시 회원가입 폼을 표시한다', () => {
    render(<AuthTabs />)
    fireEvent.click(screen.getByRole('button', { name: '회원가입' }))
    expect(screen.getByTestId('signup-form')).toBeInTheDocument()
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument()
  })

  it('로그인 탭 클릭 시 로그인 폼으로 돌아온다', () => {
    render(<AuthTabs />)
    fireEvent.click(screen.getByRole('button', { name: '회원가입' }))
    fireEvent.click(screen.getByRole('button', { name: '로그인' }))
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
  })
})
