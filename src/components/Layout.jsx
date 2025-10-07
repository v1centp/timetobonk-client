import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const NAV_ITEMS = [
  { to: "/", label: "Accueil", end: true },
  { to: "/catalog", label: "Catalogue" },
  { to: "/a-propos", label: "À propos" },
];

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalQuantity } = useCart();

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const handleKey = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const renderDesktopLink = ({ isActive }) =>
    `inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 ${
      isActive
        ? "border-white/25 bg-white/10 text-white shadow-soft"
        : "border-transparent text-zinc-400 hover:border-white/10 hover:bg-white/5 hover:text-white"
    }`;

  const renderMobileLink = ({ isActive }) =>
    `flex items-center justify-between rounded-2xl border px-4 py-3 text-base font-semibold transition ${
      isActive
        ? "border-white/20 bg-white/10 text-white shadow-soft"
        : "border-white/5 bg-neutral-900/60 text-zinc-300 hover:border-white/15 hover:bg-neutral-900"
    }`;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-neutral-950 text-zinc-100">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_50%_-10%,rgba(255,255,255,0.12),rgba(10,10,11,0.1)_60%,rgba(10,10,11,0))]" />
      <div className="pointer-events-none absolute inset-0 -z-10 grid-overlay opacity-40" />

      <header className="sticky top-0 z-40 border-b border-white/5 bg-neutral-950/80 backdrop-blur">
        <div className="container flex items-center justify-between gap-4 py-4">
          <Link
            to="/"
            className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-neutral-900/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-zinc-300 transition hover:border-white/25 hover:bg-neutral-900"
            aria-label="La réserve de la Panda Cycling"
            onClick={closeMobile}
          >
            <span className="brand-dot" />
            <span className="flex items-center gap-1">
              <span className="font-light">Panda</span>
              <strong className="font-semibold text-white">Cycling</strong>
            </span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={renderDesktopLink}>
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/checkout"
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 ${
                  isActive
                    ? "border-white/25 bg-white/10 text-white shadow-soft"
                    : "border-white/10 bg-neutral-900/60 text-zinc-200 hover:border-white/20 hover:bg-neutral-900 hover:text-white"
                }`
              }
            >
              <span>Panier</span>
              {totalQuantity > 0 && (
                <span className="inline-flex h-5 min-w-[1.5rem] items-center justify-center rounded-full bg-white/20 px-2 text-xs font-semibold text-white">
                  {totalQuantity}
                </span>
              )}
            </NavLink>
          </nav>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-neutral-900/60 text-zinc-300 transition hover:border-white/20 hover:text-white md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu de navigation"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="transition">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/60" onClick={closeMobile} aria-hidden="true" />
          <aside className="flex w-72 flex-col gap-6 border-l border-white/10 bg-neutral-950/95 p-6 shadow-soft transition-transform duration-200 ease-out">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Navigation</span>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-neutral-900/60 text-zinc-300 transition hover:border-white/20 hover:text-white"
                onClick={closeMobile}
                aria-label="Fermer le menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-3">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={renderMobileLink}
                  onClick={closeMobile}
                >
                  <span>{item.label}</span>
                  <span aria-hidden="true">→</span>
                </NavLink>
              ))}

              <NavLink to="/checkout" className={renderMobileLink} onClick={closeMobile}>
                <span>Panier</span>
                {totalQuantity > 0 ? (
                  <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-white/15 px-2 text-xs text-white">
                    {totalQuantity}
                  </span>
                ) : (
                  <span aria-hidden="true">→</span>
                )}
              </NavLink>
            </nav>
          </aside>
        </div>
      )}

      <main className="flex-1 pb-20 pt-6 sm:pt-10">{children}</main>

      <footer className="border-t border-white/5 bg-neutral-950/80 py-8">
        <div className="container flex flex-col gap-3 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Panda Cycling — Tous droits réservés.</span>
          <div className="flex items-center gap-3 text-zinc-500">
            <span className="inline-flex h-2 w-2 rounded-full bg-white/40" aria-hidden="true" />
            <span>Minimal. Clean. Vélo.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
