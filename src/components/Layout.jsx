import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/catalog", label: "Catalogue" },
  { to: "/a-propos", label: "À propos" },
];

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

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
    `rounded-md border px-4 py-2 text-sm font-semibold transition hover:border-neutral-600 hover:text-white ${
      isActive ? "border-neutral-600 text-white" : "border-transparent text-zinc-400"
    }`;

  const renderMobileLink = ({ isActive }) =>
    `block rounded-lg px-3 py-2 text-base font-semibold transition hover:bg-neutral-800 ${
      isActive ? "bg-neutral-800 text-white" : "text-zinc-300"
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-zinc-100 font-sans">
      <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur">
        <div className="container flex items-center justify-between py-4">
          <Link
            to="/"
            className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wide text-zinc-400 transition hover:text-white"
            aria-label="La réserve de la Panda Cycling"
            onClick={closeMobile}
          >
            <span className="brand-dot" />
            <span>
              La réserve de la <strong>Panda Cycling</strong>
            </span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={renderDesktopLink}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-neutral-700 p-2 text-zinc-300 transition hover:border-neutral-600 hover:text-white md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu de navigation"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={closeMobile} aria-hidden="true" />
          <aside className={`fixed top-0 bottom-0 left-0 w-64 border border-neutral-800 bg-neutral-900 shadow-lg transition-transform duration-200 ease-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
              <span className="text-sm font-semibold text-zinc-300">Menu</span>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-neutral-700 p-2 text-zinc-300 transition hover:border-neutral-600 hover:text-white"
                onClick={closeMobile}
                aria-label="Fermer le menu"
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-2 px-5 py-4">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={renderMobileLink}
                  onClick={closeMobile}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <main className="main-content">{children}</main>

      <footer className="border-t border-neutral-800 py-6">
        <div className="container flex flex-col gap-2 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Panda Cycling — Tous droits réservés.</span>
          <span className="text-zinc-600">Minimal. Clean. Vélo.</span>
        </div>
      </footer>
    </div>
  );
}
