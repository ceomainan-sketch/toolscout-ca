export default function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.25;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalf ? 1 : 0));

  return (
    <span className="inline-flex items-center gap-1" role="img" aria-label={`${rating} out of 5 stars`}>
      <span aria-hidden="true">
        <span className="text-yellow-500">{"★".repeat(fullStars)}</span>
        {hasHalf && <span className="text-yellow-500 opacity-50">★</span>}
        <span className="text-gray-300">{"★".repeat(emptyStars)}</span>
      </span>
      <span className="text-gray-500">
        {rating}/5
      </span>
    </span>
  );
}
