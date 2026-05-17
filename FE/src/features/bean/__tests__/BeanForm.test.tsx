import { render, screen } from '@testing-library/react'
import BeanForm from '../BeanForm'

jest.mock('../actions', () => ({ createBeanAction: jest.fn() }))

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: (_action: unknown, initialState: unknown) => [initialState, jest.fn(), false],
}))

const mockAction = jest.fn()

describe('BeanForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.requireMock('react').useActionState =
      (_action: unknown, initialState: unknown) => [initialState, jest.fn(), false]
  })

  it('필수 입력 필드(카페명, 원두명)가 렌더링된다', () => {
    render(<BeanForm action={mockAction} submitLabel="원두 등록" />)
    expect(screen.getByLabelText(/카페명/)).toBeInTheDocument()
    expect(screen.getByLabelText(/원두명/)).toBeInTheDocument()
  })

  it('선택 필드(원산지, 가공 방식, 로스팅)가 렌더링된다', () => {
    render(<BeanForm action={mockAction} submitLabel="원두 등록" />)
    expect(screen.getByLabelText(/원산지/)).toBeInTheDocument()
    expect(screen.getByLabelText(/가공 방식/)).toBeInTheDocument()
    expect(screen.getByLabelText(/로스팅/)).toBeInTheDocument()
  })

  it('이미지 파일 입력 필드가 렌더링된다', () => {
    render(<BeanForm action={mockAction} submitLabel="원두 등록" />)
    expect(screen.getByLabelText(/대표 이미지/)).toBeInTheDocument()
  })

  it('cafe_name 에러 메시지를 표시한다', () => {
    jest.requireMock('react').useActionState = () => [
      { errors: { cafe_name: '카페명을 입력해주세요' } },
      jest.fn(),
      false,
    ]
    render(<BeanForm action={mockAction} submitLabel="원두 등록" />)
    expect(screen.getByText('카페명을 입력해주세요')).toBeInTheDocument()
  })

  it('bean_name 에러 메시지를 표시한다', () => {
    jest.requireMock('react').useActionState = () => [
      { errors: { bean_name: '원두명을 입력해주세요' } },
      jest.fn(),
      false,
    ]
    render(<BeanForm action={mockAction} submitLabel="원두 등록" />)
    expect(screen.getByText('원두명을 입력해주세요')).toBeInTheDocument()
  })

  it('pending 상태에서 등록 버튼이 비활성화된다', () => {
    jest.requireMock('react').useActionState = () => [null, jest.fn(), true]
    render(<BeanForm action={mockAction} submitLabel="원두 등록" />)
    expect(screen.getByRole('button', { name: '등록 중...' })).toBeDisabled()
  })

  it('기본 상태에서 등록 버튼이 활성화된다', () => {
    render(<BeanForm action={mockAction} submitLabel="원두 등록" />)
    expect(screen.getByRole('button', { name: '원두 등록' })).toBeEnabled()
  })

  it('initialValues와 submitLabel을 수정 모드에 맞게 반영한다', () => {
    render(
      <BeanForm
        action={mockAction}
        submitLabel="원두 수정"
        initialValues={{
          cafe_name: '블루보틀',
          bean_name: '에티오피아 예가체프',
          origin: '에티오피아',
          process: 'Washed',
          roast_level: 'Light',
        }}
      />
    )

    expect(screen.getByDisplayValue('블루보틀')).toBeInTheDocument()
    expect(screen.getByDisplayValue('에티오피아 예가체프')).toBeInTheDocument()
    expect(screen.getByDisplayValue('에티오피아')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '원두 수정' })).toBeInTheDocument()
  })
})
