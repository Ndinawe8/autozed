import Link from "next/link";
import { auth } from "@/lib/auth";
import { signInAction, signOutAction } from "@/app/actions";
import Avatar from "@/components/Avatar";
import MobileNavMenu from "@/components/MobileNavMenu";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-sm font-black text-white">
            AZ
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Auto<span className="text-emerald-600">Zed</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 text-sm font-medium text-slate-600 md:flex">
          <Link href="/" className="rounded-md px-3 py-2 hover:bg-slate-100">
            Browse
          </Link>

          {session?.user && (
            <Link href="/dashboard" className="rounded-md px-3 py-2 hover:bg-slate-100">
              Dashboard
            </Link>
          )}

          <Link
            href="/sell"
            className="rounded-md bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-700"
          >
            Sell your car
          </Link>

          {session?.user ? (
            <div className="ml-1 flex items-center gap-2 border-l border-slate-200 pl-3">
              <Avatar src={session.user.image} name={session.user.name} />
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-md px-2 py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                >
                  Sign out
                </button>
              </form>
            </div>
          ) : (
            <form action={signInAction} className="ml-1">
              <input type="hidden" name="callbackUrl" value="/" />
              <button
                type="submit"
                className="rounded-md border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100"
              >
                Sign in
              </button>
            </form>
          )}
        </nav>

        {/* Mobile hamburger */}
        <MobileNavMenu
          isLoggedIn={!!session?.user}
          userImage={session?.user?.image}
          userName={session?.user?.name}
        />
      </div>
    </header>
  );
}
