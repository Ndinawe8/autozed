"use client";

import { useState, type ReactNode } from "react";
import CarImage from "./CarImage";

type Props = {
  images: string[];
  make: string;
  model: string;
  className?: string;
  overlay?: ReactNode;
};

export default function CarGallery({ images, make, model, className = "", overlay }: Props) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative">
        {images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={images[active] ?? images[0]}
            alt={`${make} ${model}`}
            className={`object-cover ${className}`}
          />
        ) : (
          <CarImage make={make} model={model} className={className} />
        )}
        {overlay}
      </div>

      {images.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                i === active ? "border-emerald-600" : "border-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
