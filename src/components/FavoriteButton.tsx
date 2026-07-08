"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "autozed:favorites";

function readFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function writeFavorites(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

// Heart toggle, persisted client-side only (no auth yet). Sits on top of a
// <Link>-wrapped card, so clicks must be stopped from bubbling/navigating.
export default function FavoriteButton({ listingId }: { listingId: string }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(readFavorites().has(listingId));
  }, [listingId]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const favorites = readFavorites();
    if (favorites.has(listingId)) {
      favorites.delete(listingId);
      setIsFavorite(false);
    } else {
      favorites.add(listingId);
      setIsFavorite(true);
    }
    writeFavorites(favorites);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isFavorite ? "Remove from favourites" : "Add to favourites"}
      aria-pressed={isFavorite}
      className="grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:bg-white"
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-5 w-5 ${
          isFavorite ? "fill-rose-500 text-rose-500" : "fill-none text-slate-600"
        }`}
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M12 20s-7-4.35-9.5-8.5C.6 8.1 2.1 5 5.1 5c1.8 0 3.1 1 3.9 2.3C9.8 6 11.1 5 12.9 5c3 0 4.5 3.1 2.6 6.5C19.5 15.65 12 20 12 20Z" />
      </svg>
    </button>
  );
}
