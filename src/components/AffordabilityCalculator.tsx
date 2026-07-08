"use client";

import { useState } from "react";
import { estimateMonthly, formatZmw } from "@/lib/constants";

const TERMS = [36, 48, 60, 72, 84];

// AutoTrader-style affordability calculator: collapsed by default, only
// shown once a buyer opens a listing (not on the browse grid).
export default function AffordabilityCalculator({ price }: { price: number }) {
  const [open, setOpen] = useState(false);
  const [depositPct, setDepositPct] = useState(20);
  const [months, setMonths] = useState(60);

  const deposit = Math.round((price * depositPct) / 100);
  const monthly = estimateMonthly(price, { depositPct: depositPct / 100, months });

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:border-emerald-300 hover:shadow-sm"
      >
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-900">
            Affordability calculator
          </span>
          <span className="text-sm font-medium text-emerald-700">
            Estimate monthly payments →
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="font-semibold text-slate-900">Affordability calculator</h2>

      <div className="mt-4 space-y-4">
        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <label htmlFor="deposit">Deposit</label>
            <span className="font-medium text-slate-800">
              {depositPct}% ({formatZmw(deposit)})
            </span>
          </div>
          <input
            id="deposit"
            type="range"
            min={0}
            max={50}
            step={5}
            value={depositPct}
            onChange={(e) => setDepositPct(Number(e.target.value))}
            className="w-full accent-emerald-600"
          />
        </div>

        <div>
          <label htmlFor="term" className="mb-1 block text-sm">
            Loan term
          </label>
          <select
            id="term"
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          >
            {TERMS.map((m) => (
              <option key={m} value={m}>
                {m} months
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-lg bg-emerald-50 p-4">
          <div className="text-2xl font-bold text-emerald-800">
            {formatZmw(monthly)}
            <span className="text-sm font-medium text-emerald-700"> / month</span>
          </div>
          <p className="mt-1 text-xs text-emerald-700">
            Estimate at 28% p.a. Excludes fees. Not a finance offer.
          </p>
        </div>
      </div>
    </div>
  );
}
