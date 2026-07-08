import {
  MAKE_NAMES,
  PROVINCES,
  BODY_TYPES,
  FUEL_TYPES,
  TRANSMISSIONS,
} from "@/lib/constants";

type Params = Record<string, string | undefined>;

const labelCls = "block text-xs font-medium text-slate-600 mb-1";
const inputCls =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";

// Plain GET form — submitting updates the URL query string, which the
// server page reads to filter listings. Works without client JS.
export default function SearchFilters({ params }: { params: Params }) {
  return (
    <form className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
      <div className="col-span-2 md:col-span-1">
        <label className={labelCls}>Make</label>
        <select name="make" defaultValue={params.make ?? ""} className={inputCls}>
          <option value="">Any make</option>
          {MAKE_NAMES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelCls}>Body</label>
        <select name="body" defaultValue={params.body ?? ""} className={inputCls}>
          <option value="">Any</option>
          {BODY_TYPES.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelCls}>Fuel</label>
        <select name="fuel" defaultValue={params.fuel ?? ""} className={inputCls}>
          <option value="">Any</option>
          {FUEL_TYPES.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelCls}>Gearbox</label>
        <select name="trans" defaultValue={params.trans ?? ""} className={inputCls}>
          <option value="">Any</option>
          {TRANSMISSIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelCls}>Province</label>
        <select
          name="province"
          defaultValue={params.province ?? ""}
          className={inputCls}
        >
          <option value="">Anywhere</option>
          {PROVINCES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelCls}>Max price (K)</label>
        <input
          name="maxPrice"
          type="number"
          inputMode="numeric"
          placeholder="e.g. 500000"
          defaultValue={params.maxPrice ?? ""}
          className={inputCls}
        />
      </div>
      <div className="col-span-2 flex items-end gap-2 md:col-span-4 lg:col-span-7">
        <input
          name="q"
          placeholder="Search e.g. “Hilux” or “Polo white”"
          defaultValue={params.q ?? ""}
          className={inputCls + " flex-1"}
        />
        <button
          type="submit"
          className="rounded-md bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Search
        </button>
        <a
          href="/"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Reset
        </a>
      </div>
    </form>
  );
}
