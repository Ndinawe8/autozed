import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { signInAction } from "@/app/actions";
import Link from "next/link";
import { formatZmw } from "@/lib/constants";
import DeleteListingButton from "@/components/DeleteListingButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Seller dashboard — AutoZed",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Seller dashboard</h1>
        <p className="mt-2 text-slate-500">
          Sign in with your seller account to see your listing views and
          buyer inquiries.
        </p>
        <form action={signInAction} className="mt-6">
          <input type="hidden" name="callbackUrl" value="/dashboard" />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Continue with Google
          </button>
        </form>
      </div>
    );
  }

  const listings = await prisma.listing.findMany({
    where: { userId: session.user.id },
    include: { leads: true },
    orderBy: { createdAt: "desc" },
  });

  const totalViews = listings.reduce((sum, l) => sum + l.views, 0);
  const totalLeads = listings.reduce((sum, l) => sum + l.leads.length, 0);

  const recentLeads = listings
    .flatMap((l) =>
      l.leads.map((lead) => ({
        ...lead,
        carLabel: `${l.year} ${l.make} ${l.model}`,
        listingId: l.id,
      }))
    )
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Seller dashboard</h1>
      <p className="mt-1 text-slate-500">
        Signed in as {session.user.email}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Listings" value={String(listings.length)} />
        <StatCard label="Total views" value={totalViews.toLocaleString("en-US")} />
        <StatCard label="Total inquiries" value={String(totalLeads)} />
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <h2 className="font-semibold text-slate-900">My listings</h2>
          <Link
            href="/sell"
            className="text-sm font-semibold text-emerald-700 hover:underline"
          >
            + List another car
          </Link>
        </div>

        {listings.length === 0 ? (
          <p className="p-5 text-sm text-slate-500">
            You haven&apos;t listed a car yet.{" "}
            <Link href="/sell" className="font-semibold text-emerald-700 hover:underline">
              Create your first listing
            </Link>
            .
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3">Car</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Views</th>
                <th className="px-5 py-3">Inquiries</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3">
                    <Link
                      href={`/cars/${l.id}`}
                      className="font-medium text-slate-800 hover:text-emerald-700"
                    >
                      {l.year} {l.make} {l.model}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-slate-700">{formatZmw(l.price)}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-600">
                      {l.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-700">{l.views}</td>
                  <td className="px-5 py-3 text-slate-700">{l.leads.length}</td>
                  <td className="px-5 py-3">
                    <DeleteListingButton id={l.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 font-semibold text-slate-900">Recent inquiries</h2>
        {recentLeads.length === 0 ? (
          <p className="text-sm text-slate-500">No inquiries yet.</p>
        ) : (
          <ul className="space-y-4">
            {recentLeads.map((lead) => (
              <li
                key={lead.id}
                className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-medium text-slate-800">{lead.name}</span>
                  <span className="text-xs text-slate-400">
                    {lead.createdAt.toLocaleString("en-ZM")}
                  </span>
                </div>
                <div className="text-sm text-slate-500">
                  re: {lead.carLabel} ·{" "}
                  <a href={`mailto:${lead.email}`} className="hover:underline">
                    {lead.email}
                  </a>
                  {lead.phone && <> · {lead.phone}</>}
                </div>
                <p className="mt-1 text-sm text-slate-700">{lead.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}
