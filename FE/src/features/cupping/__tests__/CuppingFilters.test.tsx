import { render, screen } from '@testing-library/react'
import CuppingFilters from '../CuppingFilters'

const beanOptions = [
  { id: 1, label: '블루보틀 - 예가체프' },
  { id: 2, label: '프릳츠 - 케냐' },
]

describe('CuppingFilters', () => {
  it('선택된 beanId와 sort를 defaultValue로 반영한다', () => {
    render(<CuppingFilters beanOptions={beanOptions} beanId="2" sort="oldest" />)

    expect(screen.getByLabelText('원두 필터')).toHaveValue('2')
    expect(screen.getByLabelText('정렬')).toHaveValue('oldest')
  })

  it('form의 method가 GET이고 action이 /cupping이다', () => {
    const { container } = render(<CuppingFilters beanOptions={beanOptions} />)
    const form = container.querySelector('form')

    expect(form).toHaveAttribute('method', 'GET')
    expect(form).toHaveAttribute('action', '/cupping')
  })

  it('전체 원두 옵션과 전달된 원두 옵션을 렌더링한다', () => {
    render(<CuppingFilters beanOptions={beanOptions} />)

    expect(screen.getByRole('option', { name: '전체 원두' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: '블루보틀 - 예가체프' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: '프릳츠 - 케냐' })).toBeInTheDocument()
  })

  it('적용 버튼에 공통 강조 호버 스타일을 적용한다', () => {
    render(<CuppingFilters beanOptions={beanOptions} />)

    expect(screen.getByRole('button', { name: '적용' })).toHaveClass(
      'hover:bg-[#6F1D2A]',
      'hover:shadow-md',
      'transition-all'
    )
  })

  it('적용 버튼에 active와 focus-visible 상태를 적용한다', () => {
    render(<CuppingFilters beanOptions={beanOptions} />)

    expect(screen.getByRole('button', { name: '적용' })).toHaveClass(
      'active:scale-[0.98]',
      'focus-visible:ring-2'
    )
  })
})
