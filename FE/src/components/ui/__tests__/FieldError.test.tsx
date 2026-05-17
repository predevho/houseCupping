import { render, screen } from '@testing-library/react'
import FieldError from '../FieldError'

describe('FieldError', () => {
  it('message가 있으면 role=alert 단락을 렌더링한다', () => {
    render(<FieldError message="카페명을 입력해주세요" />)
    expect(screen.getByRole('alert')).toHaveTextContent('카페명을 입력해주세요')
  })

  it('message가 null이면 아무것도 렌더링하지 않는다', () => {
    const { container } = render(<FieldError message={null} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('message가 undefined이면 아무것도 렌더링하지 않는다', () => {
    const { container } = render(<FieldError />)
    expect(container).toBeEmptyDOMElement()
  })
})
