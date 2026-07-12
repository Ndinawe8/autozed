import Link from "next/link";
import CarImage from "./CarImage";
import FavoriteButton from "./FavoriteButton";
import RatingBadge from "./RatingBadge";
import SpecPills from "./SpecPills";
import { formatZmw, parseImages } from "@/lib/constants";

type Card = {
  id: string;
  make: string;
  model: string;
  variant: string | null;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  condition: string;
  city: string | null;
  province: string;
  featured: boolean;
  sellerType: string;
  sellerName: string;
  rating: number | null;
  reviewCount: number | null;
  images: string;
};

export default function CarCard({ car }: { car: Card }) {
  const thumbnail = parseImages(car.images)[0];

  return (
    <Link
      href={`/cars/${car.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative">
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt={`${car.year} ${car.make} ${car.model}`}
            className="h-44 w-full object-cover"
          />
        ) : (
          <CarImage make={car.make} model={car.model} className="h-44 w-full" />
        )}
        {car.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
            Promoted
          </span>
        )}
        <div className="absolute right-3 top-3">
          <FavoriteButton listingId={car.id} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="text-xl font-bold text-slate-900">
          {formatZmw(car.price)}
        </div>

        <h3 className="mt-2 font-semibold leading-tight text-slate-900">
          {car.year} {car.make} {car.model}
        </h3>
        {car.variant && (
          <p className="mt-0.5 text-sm text-slate-500">{car.variant}</p>
        )}

        <div className="mt-3">
          <SpecPills
            condition={car.condition}
            mileage={car.mileage}
            transmission={car.transmission}
            fuelType={car.fuelType}
          />
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-medium text-slate-700">
              {car.sellerName}
            </span>
            <RatingBadge rating={car.rating} reviewCount={car.reviewCount} />
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-xs text-slate-400">
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-slate-400">
              <path d="M10 1a6 6 0 0 0-6 6c0 4.5 6 12 6 12s6-7.5 6-12a6 6 0 0 0-6-6zm0 8.5A2.5 2.5 0 1 1 10 4a2.5 2.5 0 0 1 0 5.5z" />
            </svg>
            {car.city ? `${car.city}, ` : ""}
            {car.province}
          </div>
        </div>
      </div>
    </Link>
  );
}
