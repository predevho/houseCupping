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
})
