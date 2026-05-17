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
})
