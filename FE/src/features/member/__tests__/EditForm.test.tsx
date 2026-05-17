import { render, screen } from '@testing-library/react'
import EditForm from '../EditForm'

const mockShowToast = jest.fn()

jest.mock('../actions', () => ({ updateProfileAction: jest.fn() }))
jest.mock('@/components/ui/toast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: (_action: unknown, initialState: unknown) => [initialState, jest.fn(), false],
}))

const defaultProps = {
  initialValues: { username: 'testuser', display_name: '테스트닉네임' },
}

describe('EditForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.requireMock('react').useActionState =
      (_action: unknown, initialState: unknown) => [initialState, jest.fn(), false]
  })

  it('초기값이 input에 표시된다', () => {
    render(<EditForm {...defaultProps} />)
    expect(screen.getByDisplayValue('testuser')).toBeInTheDocument()
    expect(screen.getByDisplayValue('테스트닉네임')).toBeInTheDocument()
  })

  it('username 에러 메시지를 표시한다', () => {
    jest.requireMock('react').useActionState = () => [
      { errors: { username: '이미 사용 중인 아이디입니다' } },
      jest.fn(),
      false,
    ]
    render(<EditForm {...defaultProps} />)
    expect(screen.getByText('이미 사용 중인 아이디입니다')).toBeInTheDocument()
  })

  it('display_name 에러 메시지를 표시한다', () => {
    jest.requireMock('react').useActionState = () => [
      { errors: { display_name: '4~12자로 입력해주세요' } },
      jest.fn(),
      false,
    ]
    render(<EditForm {...defaultProps} />)
    expect(screen.getByText('4~12자로 입력해주세요')).toBeInTheDocument()
  })

  it('pending 상태에서 저장 버튼이 비활성화된다', () => {
    jest.requireMock('react').useActionState = () => [null, jest.fn(), true]
    render(<EditForm {...defaultProps} />)
    expect(screen.getByRole('button', { name: '저장 중...' })).toBeDisabled()
  })

  it('기본 상태에서 저장 버튼이 활성화된다', () => {
    render(<EditForm {...defaultProps} />)
    expect(screen.getByRole('button', { name: '저장' })).toBeEnabled()
  })

  it('필드 힌트와 길이 제한을 표시한다', () => {
    render(<EditForm {...defaultProps} />)

    expect(screen.getByText('영문, 숫자, _, - 만 사용 (4~16자)')).toBeInTheDocument()
    expect(screen.getByText('4~12자')).toBeInTheDocument()
    expect(screen.getByLabelText('사용자명')).toHaveAttribute('maxLength', '16')
    expect(screen.getByLabelText('표시이름')).toHaveAttribute('maxLength', '12')
  })

  it('성공 상태에서 저장 완료 토스트를 띄운다', () => {
    jest.requireMock('react').useActionState = () => [{ success: true }, jest.fn(), false]

    render(<EditForm {...defaultProps} />)

    expect(mockShowToast).toHaveBeenCalledWith({
      message: '프로필이 저장되었어요',
      type: 'success',
    })
  })
})
