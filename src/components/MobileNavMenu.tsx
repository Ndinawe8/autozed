"use client";

import { useState } from "react";
import Link from "next/link";
import { signInAction, signOutAction } from "@/app/actions";
import Avatar from "@/components/Avatar";

type Props = {
  isLoggedIn: boolean;
  userImage?: string | null;
  userName?: string | null;
};

export default function MobileNavMenu({ isLoggedIn, userImage, userName }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        className="rounded-md p-2 text-slate-600 hover:bg-slate-100"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 border-b border-slate-200 bg-white shadow-lg">
          <div className="mx-auto max-w-6xl space-y-1 px-4 py-3">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Browse
            </Link>

            {isLoggedIn && (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Dashboard
              </Link>
            )}

            <Link
              href="/sell"
              onClick={() => setOpen(false)}
              className="block rounded-md bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Sell your car
            </Link>

            <div className="border-t border-slate-100 pt-2">
              {isLoggedIn ? (
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Avatar src={userImage} name={userName} />
                    <span className="text-sm text-slate-700">{userName}</span>
                  </div>
                  <form action={signOutAction}>
                    <button
                      type="submit"
                      className="rounded-md px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    >
                      Sign out
                    </button>
                  </form>
                </div>
              ) : (
                <form action={signInAction}>
                  <input type="hidden" name="callbackUrl" value="/" />
                  <button
                    type="submit"
                    className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Sign in with Google
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
