import { createListing, signInAction } from "@/app/actions";
import { auth } from "@/lib/auth";
import {
  MAKE_NAMES,
  PROVINCES,
  BODY_TYPES,
  FUEL_TYPES,
  TRANSMISSIONS,
  CONDITIONS,
  SELLER_TYPES,
  DRIVE_TYPES,
  SERVICE_HISTORY_OPTIONS,
  FEATURES,
} from "@/lib/constants";

export const metadata = {
  title: "Sell your car — AutoZed",
};

const labelCls = "block text-sm font-medium text-slate-700 mb-1";
const inputCls =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";

const currentYear = new Date().getFullYear();

export default async function SellPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Sell your car</h1>
        <p className="mt-2 text-slate-500">
          You&apos;ll need a free seller account to list a car. Sign in with
          Google to get started — it only takes a few seconds.
        </p>
        <form action={signInAction} className="mt-6">
          <input type="hidden" name="callbackUrl" value="/sell" />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Sell your car</h1>
      <p className="mt-1 text-slate-500">
        List your car for free. It only takes a minute. Selling as{" "}
        <span className="font-medium text-slate-700">{session.user.email}</span>.
      </p>

      <form
        action={createListing}
        className="mt-6 space-y-8 rounded-xl border border-slate-200 bg-white p-6"
      >
        {/* Car details */}
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Car details
          </legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls}>Make *</label>
              <input
                name="make"
                required
                list="makes"
                placeholder="e.g. Toyota"
                className={inputCls}
              />
              <datalist id="makes">
                {MAKE_NAMES.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </div>
            <div>
              <label className={labelCls}>Model *</label>
              <input name="model" required placeholder="e.g. Corolla" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Variant</label>
              <input name="variant" placeholder="e.g. 1.8 XS" className={inputCls} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls}>Year *</label>
              <input
                name="year"
                type="number"
                required
                min={1980}
                max={currentYear + 1}
                placeholder={String(currentYear)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Price (K) *</label>
              <input
                name="price"
                type="number"
                required
                min={1000}
                placeholder="450000"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Mileage (km) *</label>
              <input
                name="mileage"
                type="number"
                required
                min={0}
                placeholder="65000"
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Select name="bodyType" label="Body type" options={[...BODY_TYPES]} />
            <Select name="fuelType" label="Fuel" options={[...FUEL_TYPES]} />
            <Select name="transmission" label="Gearbox" options={[...TRANSMISSIONS]} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Select name="condition" label="Condition" options={[...CONDITIONS]} />
            <div>
              <label className={labelCls}>Colour</label>
              <input name="color" placeholder="e.g. White" className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              name="description"
              rows={4}
              placeholder="Service history, condition, extras, reason for selling…"
              className={inputCls}
            />
          </div>
        </fieldset>

        {/* Detailed specifications */}
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Specifications
          </legend>
          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <label className={labelCls}>Engine size</label>
              <input name="engineSize" placeholder="e.g. 2.0L" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Power (kW)</label>
              <input name="power" type="number" min={0} placeholder="110" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Doors</label>
              <input name="doors" type="number" min={1} max={6} placeholder="5" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Seats</label>
              <input name="seats" type="number" min={1} max={10} placeholder="5" className={inputCls} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-4">
            <Select name="driveType" label="Drive type" options={[...DRIVE_TYPES]} />
            <Select
              name="serviceHistory"
              label="Service history"
              options={[...SERVICE_HISTORY_OPTIONS]}
            />
            <div>
              <label className={labelCls}>Previous owners</label>
              <input name="previousOwners" type="number" min={0} placeholder="1" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Fuel use (l/100km)</label>
              <input
                name="fuelConsumption"
                type="number"
                step="0.1"
                min={0}
                placeholder="6.5"
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Features</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {FEATURES.map((feature) => (
                <label
                  key={feature}
                  className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    name="features"
                    value={feature}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  {feature}
                </label>
              ))}
            </div>
          </div>
        </fieldset>

        {/* Seller + location */}
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Your details
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select name="sellerType" label="I am a" options={[...SELLER_TYPES]} />
            <div>
              <label className={labelCls}>Display name *</label>
              <input
                name="sellerName"
                required
                defaultValue={session.user.name ?? ""}
                placeholder="Your name / dealership"
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Phone</label>
              <input name="sellerPhone" placeholder="097 1234567" className={inputCls} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select name="province" label="Province" options={[...PROVINCES]} />
            <div>
              <label className={labelCls}>City / town</label>
              <input name="city" placeholder="e.g. Kabulonga" className={inputCls} />
            </div>
          </div>
        </fieldset>

        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Publish listing
        </button>
      </form>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.2 2.8-2.5 3.6v3h3.6c2.1-2 3.4-5 3.4-8.8Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.6-3c-1 .7-2.4 1.2-4.3 1.2-3.3 0-6.1-2.2-7.1-5.3H1.2v3.1C3.1 21.3 7.2 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M4.9 14c-.2-.7-.3-1.4-.3-2.2s.1-1.5.3-2.2V6.5H1.2A11.9 11.9 0 0 0 0 11.8c0 1.9.5 3.7 1.2 5.3l3.7-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.7c1.8 0 3.4.6 4.6 1.8l3.2-3.2C17.9 1.2 15.2 0 12 0 7.2 0 3.1 2.7 1.2 6.5l3.7 3.1C5.9 6.5 8.7 4.7 12 4.7Z"
      />
    </svg>
  );
}

function Select({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: string[];
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <select name={name} defaultValue={options[0]} className={inputCls}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
