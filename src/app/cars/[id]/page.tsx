import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import CarImage from "@/components/CarImage";
import FavoriteButton from "@/components/FavoriteButton";
import RatingBadge from "@/components/RatingBadge";
import SpecPills from "@/components/SpecPills";
import AffordabilityCalculator from "@/components/AffordabilityCalculator";
import ReviewForm from "@/components/ReviewForm";
import StickyContactBar from "@/components/StickyContactBar";
import { createLead, signInAction } from "@/app/actions";
import { auth } from "@/lib/auth";
import { formatZmw, formatKm, buildWhatsAppLink, parseFeatures } from "@/lib/constants";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function CarDetail({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;

  const car = await prisma.listing.findUnique({ where: { id } });
  if (!car) notFound();

  // Count the view (best-effort; ignore races).
  await prisma.listing
    .update({ where: { id }, data: { views: { increment: 1 } } })
    .catch(() => {});

  const [session, reviews] = await Promise.all([
    auth(),
    prisma.review.findMany({
      where: { listingId: id },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  const myReview = session?.user
    ? reviews.find((r) => r.userId === session.user.id)
    : undefined;

  const specs: [string, string][] = [
    ["Year", String(car.year)],
    ["Mileage", formatKm(car.mileage)],
    ["Transmission", car.transmission],
    ["Fuel type", car.fuelType],
    ["Body type", car.bodyType],
    ["Colour", car.color ?? "—"],
    ["Condition", car.condition],
    ["Location", `${car.city ? car.city + ", " : ""}${car.province}`],
    ...(car.engineSize ? ([["Engine size", car.engineSize]] as [string, string][]) : []),
    ...(car.power != null ? ([["Power", `${car.power} kW`]] as [string, string][]) : []),
    ...(car.doors != null ? ([["Doors", String(car.doors)]] as [string, string][]) : []),
    ...(car.seats != null ? ([["Seats", String(car.seats)]] as [string, string][]) : []),
    ...(car.driveType ? ([["Drive type", car.driveType]] as [string, string][]) : []),
    ...(car.serviceHistory
      ? ([["Service history", car.serviceHistory]] as [string, string][])
      : []),
    ...(car.previousOwners != null
      ? ([["Previous owners", String(car.previousOwners)]] as [string, string][])
      : []),
    ...(car.fuelConsumption != null
      ? ([["Fuel consumption", `${car.fuelConsumption} l/100km`]] as [string, string][])
      : []),
  ];

  const features = parseFeatures(car.features);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pb-24 lg:pb-6">
      <Link
        href="/"
        className="text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        ← Back to listings
      </Link>

      {sp.new === "1" && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          ✅ Your listing is live! This is how buyers will see it.
        </div>
      )}
      {sp.sent === "1" && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          ✅ Enquiry sent — the seller will be in touch.
        </div>
      )}

      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        {/* Left: gallery + details */}
        <div className="lg:col-span-2">
          <div className="relative">
            <CarImage
              make={car.make}
              model={car.model}
              className="h-72 w-full rounded-xl md:h-96"
            />
            {car.featured && (
              <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-2.5 py-1 text-xs font-bold text-white">
                Promoted
              </span>
            )}
            <div className="absolute right-4 top-4">
              <FavoriteButton listingId={car.id} />
            </div>
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            {car.year} {car.make} {car.model}
          </h1>
          {car.variant && <p className="text-slate-500">{car.variant}</p>}

          <div className="mt-3">
            <SpecPills
              condition={car.condition}
              mileage={car.mileage}
              transmission={car.transmission}
              fuelType={car.fuelType}
            />
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 font-semibold text-slate-900">Specifications</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
              {specs.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs uppercase tracking-wide text-slate-400">
                    {k}
                  </dt>
                  <dd className="font-medium text-slate-800">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {features.length > 0 && (
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="mb-3 font-semibold text-slate-900">Features</h2>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                    <svg viewBox="0 0 20 20" className="h-4 w-4 flex-shrink-0 fill-emerald-600">
                      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {car.description && (
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="mb-2 font-semibold text-slate-900">Description</h2>
              <p className="whitespace-pre-line text-slate-700">
                {car.description}
              </p>
            </div>
          )}

          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 font-semibold text-slate-900">
              Customer reviews{reviews.length > 0 ? ` (${reviews.length})` : ""}
            </h2>

            {reviews.length === 0 ? (
              <p className="text-sm text-slate-500">
                No reviews yet — be the first to rate this car.
              </p>
            ) : (
              <ul className="space-y-4">
                {reviews.map((r) => (
                  <li
                    key={r.id}
                    className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <svg
                            key={n}
                            viewBox="0 0 20 20"
                            className={`h-4 w-4 ${
                              n <= r.rating ? "fill-amber-400" : "fill-slate-200"
                            }`}
                          >
                            <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm font-medium text-slate-800">
                        {r.user.name ?? "Anonymous"}
                      </span>
                      <span className="text-xs text-slate-400">
                        {r.createdAt.toLocaleDateString("en-ZM")}
                      </span>
                    </div>
                    {r.comment && (
                      <p className="mt-1 text-sm text-slate-700">{r.comment}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-5 border-t border-slate-100 pt-5">
              {session?.user ? (
                <ReviewForm
                  listingId={car.id}
                  initialRating={myReview?.rating}
                  initialComment={myReview?.comment ?? undefined}
                />
              ) : (
                <form
                  action={signInAction}
                  className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-4"
                >
                  <input type="hidden" name="callbackUrl" value={`/cars/${car.id}`} />
                  <span className="text-sm text-slate-600">
                    Sign in to leave a rating for this car.
                  </span>
                  <button
                    type="submit"
                    className="whitespace-nowrap rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-700"
                  >
                    Sign in
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Right: price, finance, contact */}
        <aside className="space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="text-3xl font-bold text-slate-900">
              {formatZmw(car.price)}
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  car.sellerType === "Dealer"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {car.sellerType}
              </span>
              <span className="font-medium text-slate-800">
                {car.sellerName}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <RatingBadge rating={car.rating} reviewCount={car.reviewCount} />
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-slate-400">
                  <path d="M10 1a6 6 0 0 0-6 6c0 4.5 6 12 6 12s6-7.5 6-12a6 6 0 0 0-6-6zm0 8.5A2.5 2.5 0 1 1 10 4a2.5 2.5 0 0 1 0 5.5z" />
                </svg>
                {car.city ? `${car.city}, ` : ""}
                {car.province}
              </div>
            </div>
            {car.sellerPhone && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <a
                  href={`tel:${car.sellerPhone.replace(/\s/g, "")}`}
                  className="block rounded-lg bg-slate-900 py-2.5 text-center text-sm font-semibold text-white hover:bg-slate-700"
                >
                  📞 Call
                </a>
                <a
                  href={buildWhatsAppLink(
                    car.sellerPhone,
                    `Hi, is the ${car.year} ${car.make} ${car.model} still available?`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-[#25D366] py-2.5 text-center text-sm font-semibold text-white hover:bg-[#1ebe5a]"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
                    <path d="M17.5 14.4c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.2-.6.9-.8 1.1-.1.2-.3.2-.5.1-1.4-.6-2.3-1.3-3.2-2.8-.1-.2-.1-.4.1-.6.2-.2.5-.5.6-.7.1-.2.1-.4 0-.6-.1-.2-.6-1.5-.8-2-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2 0 1.3 1 2.6 1.1 2.8.1.2 1.9 3 4.7 4.1 2.3.9 2.8.7 3.3.6.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.1.2-1.2-.1-.2-.2-.2-.4-.3Z" />
                    <path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .9.9-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            )}
          </div>

          <AffordabilityCalculator price={car.price} />

          {/* Contact form (server action) */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 font-semibold text-slate-900">
              Enquire about this car
            </h2>
            <form action={createLead} className="space-y-3">
              <input type="hidden" name="listingId" value={car.id} />
              <input
                name="name"
                required
                placeholder="Your name"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email address"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
              <input
                name="phone"
                placeholder="Phone (optional)"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
              <textarea
                name="message"
                required
                rows={3}
                defaultValue={`Hi, is the ${car.year} ${car.make} ${car.model} still available?`}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Send enquiry
              </button>
            </form>
          </div>
        </aside>
      </div>

      {car.sellerPhone && (
        <StickyContactBar
          phone={car.sellerPhone}
          year={car.year}
          make={car.make}
          model={car.model}
        />
      )}
    </div>
  );
}
