import { render, screen, fireEvent } from '@testing-library/react'
import SignupForm from '../SignupForm'

jest.mock('../actions', () => ({ signupAction: jest.fn() }))

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: (_action: unknown, initialState: unknown) => [initialState, jest.fn(), false],
}))

describe('SignupForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.requireMock('react').useActionState =
      (_action: unknown, initialState: unknown) => [initialState, jest.fn(), false]
  })

  it('5개 필드를 모두 렌더링한다', () => {
    render(<SignupForm />)
    expect(screen.getByLabelText('아이디')).toBeInTheDocument()
    expect(screen.getByLabelText('닉네임')).toBeInTheDocument()
    expect(screen.getByLabelText('이메일')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호 확인')).toBeInTheDocument()
  })

  it('username 에러 상태가 있으면 아이디 필드 아래 에러를 표시한다', () => {
    const react = jest.requireMock('react')
    react.useActionState = () => [
      { errors: { username: '이미 사용 중인 아이디입니다' } },
      jest.fn(),
      false,
    ]
    render(<SignupForm />)
    expect(screen.getByText('이미 사용 중인 아이디입니다')).toBeInTheDocument()
  })

  it('비밀번호 불일치 시 클라이언트 에러를 표시한다', () => {
    render(<SignupForm />)
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText('비밀번호 확인'), { target: { value: 'different123' } })
    fireEvent.click(screen.getByRole('button', { name: '가입하기' }))
    expect(screen.getByText('비밀번호가 일치하지 않습니다')).toBeInTheDocument()
  })

  it('pending 상태에서 버튼이 비활성화된다', () => {
    const react = jest.requireMock('react')
    react.useActionState = () => [null, jest.fn(), true]
    render(<SignupForm />)
    expect(screen.getByRole('button', { name: '가입 중...' })).toBeDisabled()
  })
})
