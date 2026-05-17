import { render, screen, within } from '@testing-library/react'
import CircleRatingDisplay from '../CircleRatingDisplay'

describe('CircleRatingDisplay', () => {
  it('0.5 단위를 5개 원의 full/half/empty 상태로 렌더링한다', () => {
    render(<CircleRatingDisplay label="향미" value={3.5} />)

    const group = screen.getByLabelText('향미 3.5점')
    const circles = within(group).getAllByTestId(/circle-/)

    expect(circles).toHaveLength(5)
    expect(circles[0]).toHaveAttribute('data-fill', 'full')
    expect(circles[1]).toHaveAttribute('data-fill', 'full')
    expect(circles[2]).toHaveAttribute('data-fill', 'full')
    expect(circles[3]).toHaveAttribute('data-fill', 'half')
    expect(circles[4]).toHaveAttribute('data-fill', 'empty')
  })
})
