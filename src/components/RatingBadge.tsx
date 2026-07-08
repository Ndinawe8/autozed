// Star rating + review count for dealers, or a neutral "No Rating" pill
// for private sellers (who have no rating/reviewCount on the Listing).

export default function RatingBadge({
  rating,
  reviewCount,
}: {
  rating: number | null;
  reviewCount: number | null;
}) {
  if (rating == null) {
    return (
      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
        No Rating
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <svg viewBox="0 0 20 20" className="h-4 w-4 fill-amber-400">
        <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8z" />
      </svg>
      <span className="font-semibold text-slate-800">{rating.toFixed(1)}</span>
      {reviewCount != null && (
        <span className="text-slate-400">({reviewCount} reviews)</span>
      )}
    </span>
  );
}
