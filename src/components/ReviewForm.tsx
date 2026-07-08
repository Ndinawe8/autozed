"use client";

import { useState } from "react";
import { createReview } from "@/app/actions";

// Star picker + comment box for a signed-in customer to rate a listing.
// Submits straight to the createReview server action.
export default function ReviewForm({
  listingId,
  initialRating,
  initialComment,
}: {
  listingId: string;
  initialRating?: number;
  initialComment?: string;
}) {
  const [rating, setRating] = useState(initialRating ?? 0);
  const [hover, setHover] = useState(0);

  return (
    <form action={createReview} className="space-y-3">
      <input type="hidden" name="listingId" value={listingId} />
      <input type="hidden" name="rating" value={rating} />
      <div>
        <p className="mb-1 text-sm font-medium text-slate-700">
          {initialRating ? "Update your rating" : "Rate this car"}
        </p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
            >
              <svg
                viewBox="0 0 20 20"
                className={`h-7 w-7 ${
                  (hover || rating) >= n ? "fill-amber-400" : "fill-slate-200"
                }`}
              >
                <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8z" />
              </svg>
            </button>
          ))}
        </div>
      </div>
      <textarea
        name="comment"
        rows={2}
        defaultValue={initialComment}
        placeholder="Share your experience (optional)"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={rating === 0}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {initialRating ? "Update rating" : "Submit rating"}
      </button>
    </form>
  );
}
