function StarRating({ rating, reviewCount }) {
  if (!rating) return null

  const rounded = Math.round(rating * 2) / 2
  const stars = []
  for (let i = 1; i <= 5; i++) {
    const filled = rounded >= i
    stars.push(
      <span key={i} className={filled ? '' : 'dim'} aria-hidden="true">
        {filled ? '★' : '☆'}
      </span>
    )
  }
  const countLabel = `${reviewCount} review${reviewCount !== 1 ? 's' : ''}`

  return (
    <div className="pdp-rating" role="img" aria-label={`Rated ${rating} out of 5 stars, ${countLabel}`}>
      <span className="stars">{stars}</span>
      <span className="count">{countLabel}</span>
    </div>
  )
}

export default StarRating