import { render, screen } from '@testing-library/react'
import BeanSearch from '../BeanSearch'

describe('BeanSearch', () => {
  it('q prop이 없으면 input이 비어 있다', () => {
    render(<BeanSearch />)
    expect(screen.getByRole('searchbox')).toHaveValue('')
  })

  it('q prop이 있으면 input의 defaultValue로 반영한다', () => {
    render(<BeanSearch q="에티오피아" />)
    expect(screen.getByRole('searchbox')).toHaveValue('에티오피아')
  })

  it('form의 method가 GET이고 action이 /beans이다', () => {
    const { container } = render(<BeanSearch />)
    const form = container.querySelector('form')
    expect(form).toHaveAttribute('method', 'GET')
    expect(form).toHaveAttribute('action', '/beans')
  })

  it('검색 버튼에 공통 강조 호버 스타일을 적용한다', () => {
    render(<BeanSearch />)

    expect(screen.getByRole('button', { name: '검색' })).toHaveClass(
      'hover:bg-[#6F1D2A]',
      'hover:shadow-md',
      'transition-all'
    )
  })

  it('검색 버튼에 active와 focus-visible 상태를 적용한다', () => {
    render(<BeanSearch />)

    expect(screen.getByRole('button', { name: '검색' })).toHaveClass(
      'active:scale-[0.98]',
      'focus-visible:ring-2'
    )
  })
})
