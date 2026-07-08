import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import SearchFilters from "@/components/SearchFilters";
import CarCard from "@/components/CarCard";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | undefined>>;

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const where: Prisma.ListingWhereInput = { status: "active" };
  if (params.make) where.make = params.make;
  if (params.body) where.bodyType = params.body;
  if (params.fuel) where.fuelType = params.fuel;
  if (params.trans) where.transmission = params.trans;
  if (params.province) where.province = params.province;
  if (params.maxPrice) {
    const max = parseInt(params.maxPrice.replace(/\D/g, ""), 10);
    if (max) where.price = { lte: max };
  }
  if (params.q) {
    const q = params.q.trim();
    where.OR = [
      { make: { contains: q } },
      { model: { contains: q } },
      { variant: { contains: q } },
      { color: { contains: q } },
      { city: { contains: q } },
    ];
  }

  const cars = await prisma.listing.findMany({
    where,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  const hasFilters = Object.keys(params).length > 0;

  return (
    <>
      {/* Hero + search */}
      <section className="border-b border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Find your next car in Zambia
          </h1>
          <p className="mt-2 max-w-xl text-slate-300">
            Thousands of used &amp; new cars from trusted dealers and private
            sellers. Search, compare and enquire — all in one place.
          </p>
          <div className="mt-6 rounded-2xl bg-white p-4 shadow-xl">
            <SearchFilters params={params} />
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {hasFilters ? "Search results" : "Latest listings"}
          </h2>
          <span className="text-sm text-slate-500">
            {cars.length} {cars.length === 1 ? "car" : "cars"}
          </span>
        </div>

        {cars.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <p className="text-slate-600">No cars match your search.</p>
            <a
              href="/"
              className="mt-3 inline-block text-sm font-semibold text-emerald-700 hover:underline"
            >
              Clear filters
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
