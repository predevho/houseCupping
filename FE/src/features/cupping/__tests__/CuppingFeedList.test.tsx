import { render, screen } from '@testing-library/react'
import CuppingFeedList from '../CuppingFeedList'

const notes = [
  {
    id: 12,
    aroma: 4,
    acidity: 3.5,
    body: 3,
    roast_date: '2026-05-15',
    memo: '복숭아 향과 말린 자두 느낌',
    created_at: '2026-05-17T10:00:00.000Z',
    profiles: { username: 'tester', display_name: '테스터' },
    beans: { id: 2, bean_name: '예가체프', cafe_name: '블루보틀' },
    likes: [{ count: 3 }],
    comments: [{ count: 2 }],
  },
]

describe('CuppingFeedList', () => {
  it('원두명, 작성자, 메모 일부를 렌더링한다', () => {
    render(<CuppingFeedList notes={notes} emptyMessage="없음" />)

    expect(screen.getByText('예가체프 - 블루보틀')).toBeInTheDocument()
    expect(screen.getByText('테스터')).toBeInTheDocument()
    expect(screen.getByText('복숭아 향과 말린 자두 느낌')).toBeInTheDocument()
  })

  it('카드 전체가 상세 페이지 링크다', () => {
    render(<CuppingFeedList notes={notes} emptyMessage="없음" />)

    expect(screen.getByRole('link', { name: /예가체프 - 블루보틀/i })).toHaveAttribute(
      'href',
      '/cupping/12'
    )
  })

  it('노트가 없으면 빈 상태 문구를 보여준다', () => {
    render(<CuppingFeedList notes={[]} emptyMessage="아직 등록된 커핑 노트가 없어요" />)

    expect(screen.getByText('아직 등록된 커핑 노트가 없어요')).toBeInTheDocument()
  })

  it('좋아요 수와 댓글 수를 카드에 표시한다', () => {
    render(<CuppingFeedList notes={notes} emptyMessage="없음" />)

    expect(screen.getByText(/♥ 3/)).toBeInTheDocument()
    expect(screen.getByText(/💬 2/)).toBeInTheDocument()
  })

  it('likes/comments가 null이면 0으로 표시한다', () => {
    const nullNotes = [{ ...notes[0], likes: null, comments: null }]
    render(<CuppingFeedList notes={nullNotes} emptyMessage="없음" />)

    expect(screen.getByText(/♥ 0/)).toBeInTheDocument()
    expect(screen.getByText(/💬 0/)).toBeInTheDocument()
  })
})
