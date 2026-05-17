interface BeanRatingScore {
  score: number
}

export function buildRatingSummary(ratings: BeanRatingScore[]) {
  if (ratings.length === 0) return null

  const total = ratings.reduce((sum, rating) => sum + rating.score, 0)
  const average = Math.round((total / ratings.length) * 10) / 10

  return {
    average,
    count: ratings.length,
  }
}
