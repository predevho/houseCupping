import { render, screen } from '@testing-library/react'
import BeanForm from '../BeanForm'

jest.mock('../actions', () => ({ createBeanAction: jest.fn() }))

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: (_action: unknown, initialState: unknown) => [initialState, jest.fn(), false],
}))

describe('BeanForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.requireMock('react').useActionState =
      (_action: unknown, initialState: unknown) => [initialState, jest.fn(), false]
  })

  it('필수 입력 필드(카페명, 원두명)가 렌더링된다', () => {
    render(<BeanForm />)
    expect(screen.getByLabelText(/카페명/)).toBeInTheDocument()
    expect(screen.getByLabelText(/원두명/)).toBeInTheDocument()
  })

  it('선택 필드(원산지, 가공 방식, 로스팅)가 렌더링된다', () => {
    render(<BeanForm />)
    expect(screen.getByLabelText(/원산지/)).toBeInTheDocument()
    expect(screen.getByLabelText(/가공 방식/)).toBeInTheDocument()
    expect(screen.getByLabelText(/로스팅/)).toBeInTheDocument()
  })

  it('cafe_name 에러 메시지를 표시한다', () => {
    jest.requireMock('react').useActionState = () => [
      { errors: { cafe_name: '카페명을 입력해주세요' } },
      jest.fn(),
      false,
    ]
    render(<BeanForm />)
    expect(screen.getByText('카페명을 입력해주세요')).toBeInTheDocument()
  })

  it('bean_name 에러 메시지를 표시한다', () => {
    jest.requireMock('react').useActionState = () => [
      { errors: { bean_name: '원두명을 입력해주세요' } },
      jest.fn(),
      false,
    ]
    render(<BeanForm />)
    expect(screen.getByText('원두명을 입력해주세요')).toBeInTheDocument()
  })

  it('pending 상태에서 등록 버튼이 비활성화된다', () => {
    jest.requireMock('react').useActionState = () => [null, jest.fn(), true]
    render(<BeanForm />)
    expect(screen.getByRole('button', { name: '등록 중...' })).toBeDisabled()
  })

  it('기본 상태에서 등록 버튼이 활성화된다', () => {
    render(<BeanForm />)
    expect(screen.getByRole('button', { name: '원두 등록' })).toBeEnabled()
  })
})
