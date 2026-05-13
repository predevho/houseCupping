import { render, screen } from '@testing-library/react'
import LoginForm from '../LoginForm'

jest.mock('../actions', () => ({ loginAction: jest.fn() }))

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: (_action: unknown, initialState: unknown) => [initialState, jest.fn(), false],
}))

describe('LoginForm', () => {
  it('아이디와 비밀번호 필드를 렌더링한다', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText('아이디')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
  })

  it('에러 상태가 있으면 에러 메시지를 표시한다', () => {
    const react = jest.requireMock('react')
    react.useActionState = () => [
      { error: '아이디 또는 비밀번호가 올바르지 않습니다' },
      jest.fn(),
      false,
    ]
    render(<LoginForm />)
    expect(
      screen.getByText('아이디 또는 비밀번호가 올바르지 않습니다')
    ).toBeInTheDocument()
  })

  it('pending 상태에서 버튼이 비활성화된다', () => {
    const react = jest.requireMock('react')
    react.useActionState = () => [null, jest.fn(), true]
    render(<LoginForm />)
    expect(screen.getByRole('button', { name: '로그인 중...' })).toBeDisabled()
  })
})
