import { buildRatingSummary } from '../ratingSummary'

describe('buildRatingSummary', () => {
  it('평점이 없으면 null을 반환한다', () => {
    expect(buildRatingSummary([])).toBeNull()
  })

  it('평균 평점과 참여 인원 수를 계산한다', () => {
    expect(buildRatingSummary([{ score: 4.5 }, { score: 3.5 }, { score: 4.0 }])).toEqual({
      average: 4,
      count: 3,
    })
  })

  it('소수점 첫째 자리까지 반올림한다', () => {
    expect(buildRatingSummary([{ score: 4.0 }, { score: 4.5 }])).toEqual({
      average: 4.3,
      count: 2,
    })
  })
})
