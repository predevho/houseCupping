import { render, screen } from '@testing-library/react'
import CuppingForm from '../CuppingForm'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: (_action: unknown, initialState: unknown) => [initialState, jest.fn(), false],
}))

const mockAction = jest.fn()

const defaultProps = {
  beanId: 'bean-123',
  beanLabel: '블루보틀 — 에티오피아 예가체프',
  action: mockAction,
  submitLabel: '커핑 노트 등록',
}

describe('CuppingForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.requireMock('react').useActionState =
      (_action: unknown, initialState: unknown) => [initialState, jest.fn(), false]
  })

  it('필수 필드(향미, 산미, 바디)가 렌더링된다', () => {
    render(<CuppingForm {...defaultProps} />)
    expect(screen.getByLabelText(/향미/)).toBeInTheDocument()
    expect(screen.getByLabelText(/산미/)).toBeInTheDocument()
    expect(screen.getByLabelText(/바디/)).toBeInTheDocument()
  })

  it('선택 필드(로스팅 날짜, 메모, 종합 평점)가 렌더링된다', () => {
    render(<CuppingForm {...defaultProps} />)
    expect(screen.getByLabelText(/로스팅 날짜/)).toBeInTheDocument()
    expect(screen.getByLabelText(/메모/)).toBeInTheDocument()
    expect(screen.getByLabelText(/종합 평점/)).toBeInTheDocument()
  })

  it('submitLabel이 버튼에 렌더링된다', () => {
    render(<CuppingForm {...defaultProps} submitLabel="수정하기" />)
    expect(screen.getByRole('button', { name: '수정하기' })).toBeInTheDocument()
  })

  it('aroma 에러 메시지를 표시한다', () => {
    jest.requireMock('react').useActionState = () => [
      { errors: { aroma: '향미는 0.5~5.0 사이로 입력해주세요' } },
      jest.fn(),
      false,
    ]
    render(<CuppingForm {...defaultProps} />)
    expect(screen.getByText('향미는 0.5~5.0 사이로 입력해주세요')).toBeInTheDocument()
  })

  it('pending 상태에서 버튼이 비활성화된다', () => {
    jest.requireMock('react').useActionState = () => [null, jest.fn(), true]
    render(<CuppingForm {...defaultProps} />)
    expect(screen.getByRole('button', { name: '처리 중...' })).toBeDisabled()
  })

  it('기본 상태에서 등록 버튼이 활성화된다', () => {
    render(<CuppingForm {...defaultProps} />)
    expect(screen.getByRole('button', { name: '커핑 노트 등록' })).toBeEnabled()
  })

  it('initialValues가 있으면 aroma select의 defaultValue가 설정된다', () => {
    const initialValues = {
      aroma: 4.0,
      acidity: 3.5,
      body: 3.0,
      roast_date: '2025-03-15',
      memo: '테스트 메모',
      score: 4.5,
    }
    render(<CuppingForm {...defaultProps} noteId="note-1" initialValues={initialValues} />)
    const aromaSelect = screen.getByLabelText(/향미/) as HTMLSelectElement
    expect(aromaSelect.value).toBe('4')
  })
})
