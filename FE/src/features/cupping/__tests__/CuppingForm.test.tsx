import { fireEvent, render, screen } from '@testing-library/react'
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
    expect(screen.getByText(/향미 \(Aroma\)/)).toBeInTheDocument()
    expect(screen.getByText(/산미 \(Acidity\)/)).toBeInTheDocument()
    expect(screen.getByText(/바디 \(Body\)/)).toBeInTheDocument()
  })

  it('선택 필드(로스팅 날짜, 메모, 종합 평점)가 렌더링된다', () => {
    render(<CuppingForm {...defaultProps} />)
    expect(screen.getByLabelText(/로스팅 날짜/)).toBeInTheDocument()
    expect(screen.getByLabelText(/메모/)).toBeInTheDocument()
    expect(screen.getByText(/종합 평점/)).toBeInTheDocument()
  })

  it('로스팅 날짜 입력에 오늘 날짜 max 제약을 건다', () => {
    render(<CuppingForm {...defaultProps} />)

    const roastDateInput = screen.getByLabelText(/로스팅 날짜/) as HTMLInputElement

    expect(roastDateInput).toHaveAttribute('type', 'date')
    expect(roastDateInput).toHaveAttribute('max')
    expect(roastDateInput.getAttribute('max')).toMatch(/^\d{4}-\d{2}-\d{2}$/)
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

  it('initialValues가 있으면 aroma/acidity/body select의 defaultValue가 설정된다', () => {
    const initialValues = {
      aroma: 4.0,
      acidity: 3.5,
      body: 3.0,
      roast_date: '2025-03-15',
      memo: '테스트 메모',
      score: 4.5,
    }
    render(<CuppingForm {...defaultProps} noteId="note-1" initialValues={initialValues} />)
    const aromaInput = screen.getByDisplayValue('4') as HTMLInputElement
    const acidityInput = screen.getByDisplayValue('3.5') as HTMLInputElement
    const bodyInput = screen.getByDisplayValue('3') as HTMLInputElement

    expect(aromaInput).toHaveAttribute('name', 'aroma')
    expect(acidityInput).toHaveAttribute('name', 'acidity')
    expect(bodyInput).toHaveAttribute('name', 'body')
  })

  it('원형 점수 버튼을 클릭하면 hidden input 값이 갱신된다', () => {
    render(<CuppingForm {...defaultProps} />)

    fireEvent.click(screen.getByRole('button', { name: '향미 3.5점 선택' }))

    expect(screen.getByDisplayValue('3.5')).toHaveAttribute('name', 'aroma')
  })

  it('드래그로도 원형 점수 값을 0.5 단위로 변경할 수 있다', () => {
    render(<CuppingForm {...defaultProps} />)

    const dragArea = screen.getByLabelText('향미 점수 선택 영역')

    Object.defineProperty(dragArea, 'getBoundingClientRect', {
      value: () => ({
        left: 0,
        top: 0,
        width: 200,
        height: 28,
        right: 200,
        bottom: 28,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }),
    })

    fireEvent.mouseDown(dragArea, { clientX: 140, buttons: 1 })
    fireEvent.mouseMove(dragArea, { clientX: 140, buttons: 1 })
    fireEvent.mouseUp(dragArea)

    expect(screen.getByDisplayValue('3.5')).toHaveAttribute('name', 'aroma')
  })

  it('종합 평점이 바디 아래에 같은 원형 UI로 렌더링된다', () => {
    render(<CuppingForm {...defaultProps} />)

    const bodyLabel = screen.getByText(/바디 \(Body\)/)
    const scoreLabel = screen.getByText(/종합 평점/)

    expect(bodyLabel.compareDocumentPosition(scoreLabel)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    expect(screen.getByLabelText('종합 평점 점수 선택 영역')).toBeInTheDocument()
  })
})
