import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import pandaLogo from "../assets/panda logo.png";

const NAV_ITEMS = [
  { to: "/", label: "Accueil", end: true },
  { to: "/sorties", label: "Sorties" },
  { to: "/kom", label: "KOM" },
  { to: "/evenements", label: "Événements" },
  { to: "/catalog", label: "Shop" },
  { to: "/a-propos", label: "À propos" },
];

// Navigation bottom bar pour mobile
const BOTTOM_NAV_ITEMS = [
  { to: "/", label: "Accueil", end: true, icon: "home" },
  { to: "/sorties", label: "Sorties", icon: "bike" },
  { to: "/catalog", label: "Shop", icon: "shop" },
  { to: null, label: "Menu", icon: "menu", isMenuButton: true },
];

const NavIcon = ({ icon, className = "w-5 h-5" }) => {
  switch (icon) {
    case "home":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      );
    case "bike":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 17.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM19 17.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM12 14l-2.5-5.5L12 7l3.5 1.5L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 14l4.5-5.5M15.5 8.5L19 14" />
        </svg>
      );
    case "shop":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
        </svg>
      );
    case "cart":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      );
    case "menu":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      );
    default:
      return null;
  }
};

const SOCIAL_LINKS = [
  {
    platform: "instagram",
    url: "https://www.instagram.com/panda_cycling?igsh=NTBpc2ZzZ2V5N3Jz",
    label: "Instagram",
  },
  {
    platform: "whatsapp",
    url: "https://chat.whatsapp.com/H1RW0OpgOfH7TXJ8OKGA0n",
    label: "WhatsApp",
  },
];

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { totalQuantity } = useCart();
  const location = useLocation();

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const handleKey = (event) => {
      if (event.key === "Escape") {
        closeMobileWithAnimation();
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

  const closeMobile = () => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const closeMobileWithAnimation = () => {
    setIsClosing(true);
    setTimeout(() => {
      setMobileOpen(false);
      setIsClosing(false);
    }, 200);
  };

  const renderDesktopLink = ({ isActive }) =>
    `inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bamboo-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-panda-950 ${
      isActive
        ? "border-bamboo-500/30 bg-bamboo-500/10 text-white shadow-soft"
        : "border-transparent text-panda-300 hover:border-panda-700 hover:bg-panda-800/50 hover:text-white"
    }`;

  const renderMobileLink = ({ isActive }) =>
    `flex items-center justify-between rounded-2xl border px-4 py-3 text-base font-semibold transition ${
      isActive
        ? "border-bamboo-500/30 bg-bamboo-500/10 text-white shadow-soft"
        : "border-panda-700/50 bg-panda-800/60 text-panda-200 hover:border-panda-600 hover:bg-panda-800"
    }`;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-panda-950 text-panda-100">
      {/* Gradient décoratif avec touche de vert */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.15),transparent)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 grid-overlay opacity-50" />

      <header className="sticky top-0 z-40 border-b border-panda-800/50 bg-panda-950">
        <div className="container flex items-center justify-between gap-4 py-4">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-full border border-panda-700/50 bg-panda-900/80 pl-1.5 pr-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-panda-200 transition hover:border-bamboo-500/30 hover:bg-panda-800"
            aria-label="Panda Cycling - Club de vélo"
            onClick={closeMobile}
          >
            <img
              src={pandaLogo}
              alt=""
              className="h-7 w-7 object-cover rounded-full"
              style={{ objectPosition: "center 40%" }}
            />
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
                `inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bamboo-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-panda-950 ${
                  isActive
                    ? "border-bamboo-500/30 bg-bamboo-500/10 text-white shadow-soft"
                    : "border-panda-700 bg-panda-800/80 text-panda-100 hover:border-panda-600 hover:bg-panda-800 hover:text-white"
                }`
              }
            >
              <span>Panier</span>
              {totalQuantity > 0 && (
                <span className="inline-flex h-5 min-w-[1.5rem] items-center justify-center rounded-full bg-bamboo-500 px-2 text-xs font-semibold text-white">
                  {totalQuantity}
                </span>
              )}
            </NavLink>

            {/* Liens sociaux */}
            <div className="flex items-center gap-1 ml-2 border-l border-panda-700/50 pl-3">
              <a
                href={SOCIAL_LINKS[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-panda-700/50 bg-panda-800/80 text-panda-400 transition hover:border-bamboo-500/30 hover:bg-panda-800 hover:text-bamboo-400"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href={SOCIAL_LINKS[1].url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-panda-700/50 bg-panda-800/80 text-panda-400 transition hover:border-bamboo-500/30 hover:bg-panda-800 hover:text-bamboo-400"
                aria-label="WhatsApp"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/checkout"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-panda-700/50 bg-panda-800/80 text-panda-200 transition hover:border-panda-600 hover:text-white"
              aria-label="Panier"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalQuantity > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-bamboo-500 px-1 text-xs font-bold text-white">
                  {totalQuantity}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-panda-700/50 bg-panda-800/80 text-panda-200 transition hover:border-panda-600 hover:text-white"
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir le menu de navigation"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="transition">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-panda-950/90 backdrop-blur-sm transition-opacity duration-200 ${isClosing ? "opacity-0" : "opacity-100"}`}
            onClick={closeMobileWithAnimation}
            aria-hidden="true"
          />
          {/* Drawer plein écran sur mobile */}
          <aside
            className={`absolute inset-0 flex flex-col bg-panda-900 transition-transform duration-200 ease-out ${isClosing ? "translate-x-full" : "translate-x-0"}`}
          >
            {/* Header du drawer */}
            <div className="flex items-center justify-between border-b border-panda-700/50 px-5 py-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2"
                onClick={closeMobile}
              >
                <img
                  src={pandaLogo}
                  alt=""
                  className="h-8 w-8 object-cover rounded-full"
                  style={{ objectPosition: "center 40%" }}
                />
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-panda-200">
                  <span className="font-light">Panda</span>{" "}
                  <span className="text-white">Cycling</span>
                </span>
              </Link>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-panda-700/50 bg-panda-800/80 text-panda-200 transition hover:border-panda-600 hover:text-white"
                onClick={closeMobileWithAnimation}
                aria-label="Fermer le menu"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>

            {/* Navigation principale */}
            <nav className="flex-1 overflow-y-auto p-5">
              <div className="grid gap-2">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={renderMobileLink}
                    onClick={closeMobile}
                  >
                    <span>{item.label}</span>
                    <span aria-hidden="true" className="text-bamboo-400">→</span>
                  </NavLink>
                ))}

                <NavLink to="/checkout" className={renderMobileLink} onClick={closeMobile}>
                  <span>Panier</span>
                  {totalQuantity > 0 ? (
                    <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-bamboo-500 px-2 text-xs font-semibold text-white">
                      {totalQuantity}
                    </span>
                  ) : (
                    <span aria-hidden="true" className="text-bamboo-400">→</span>
                  )}
                </NavLink>
              </div>
            </nav>

            {/* Liens sociaux mobile */}
            <div className="border-t border-panda-700/50 p-5">
              <p className="text-xs text-panda-400 mb-3">Suivez-nous</p>
              <div className="flex items-center gap-3">
                <a
                  href={SOCIAL_LINKS[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-panda-700/50 bg-panda-800/80 text-panda-300 transition hover:border-bamboo-500/30 hover:text-bamboo-400"
                  aria-label="Instagram"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a
                  href={SOCIAL_LINKS[1].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-panda-700/50 bg-panda-800/80 text-panda-300 transition hover:border-bamboo-500/30 hover:text-bamboo-400"
                  aria-label="WhatsApp"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
                <a
                  href="https://www.strava.com/clubs/panda-cycling"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-panda-700/50 bg-panda-800/80 text-panda-300 transition hover:border-bamboo-500/30 hover:text-bamboo-400"
                  aria-label="Strava"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                  </svg>
                </a>
              </div>
            </div>
          </aside>
        </div>
      )}

      <main className="flex-1 pb-24 pt-6 sm:pb-20 sm:pt-10">{children}</main>

      {/* Bottom navigation mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-panda-700/50 bg-panda-900/95 backdrop-blur-lg md:hidden safe-area-bottom">
        <div className="grid grid-cols-4">
          {BOTTOM_NAV_ITEMS.map((item) => {
            // Bouton menu
            if (item.isMenuButton) {
              return (
                <button
                  key="menu"
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="relative flex flex-col items-center gap-1 py-3 text-panda-400 transition-colors active:text-panda-200"
                >
                  <div className="relative">
                    <NavIcon icon={item.icon} className="w-6 h-6" />
                    {totalQuantity > 0 && (
                      <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-bamboo-500 ring-2 ring-panda-900" />
                    )}
                  </div>
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            }

            // Liens de navigation
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to) && item.to !== "/";
            const active = item.to === "/" ? location.pathname === "/" : isActive;

            const handleClick = (e) => {
              if (active) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            };

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={handleClick}
                className={`flex flex-col items-center gap-1 py-3 transition-colors ${
                  active
                    ? "text-bamboo-400"
                    : "text-panda-400 active:text-panda-200"
                }`}
              >
                <NavIcon icon={item.icon} className={`w-6 h-6 ${active ? "stroke-[2]" : ""}`} />
                <span className={`text-[10px] font-medium ${active ? "font-semibold" : ""}`}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <footer className="border-t border-panda-800/50 bg-panda-900/50 py-12 mb-16 md:mb-0">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            {/* Logo + Description */}
            <div className="md:col-span-2">
              <Link to="/" className="inline-flex items-center gap-2 mb-4">
                <img
                  src={pandaLogo}
                  alt=""
                  className="h-8 w-8 object-cover rounded-full"
                  style={{ objectPosition: "center 40%" }}
                />
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-panda-200">
                  <span className="font-light">Panda</span>{" "}
                  <span className="text-white">Cycling</span>
                </span>
              </Link>
              <p className="text-sm text-panda-400 max-w-xs mb-4">
                Communauté de cyclistes amateurs basée à Lausanne. Sorties hebdomadaires
                sur Zwift l'hiver, sur route dès la belle saison.
              </p>
              {/* Liens sociaux */}
              <div className="flex items-center gap-2">
                <a
                  href={SOCIAL_LINKS[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-panda-700/50 bg-panda-800/80 text-panda-400 transition hover:border-bamboo-500/30 hover:text-bamboo-400"
                  aria-label="Instagram"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a
                  href={SOCIAL_LINKS[1].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-panda-700/50 bg-panda-800/80 text-panda-400 transition hover:border-bamboo-500/30 hover:text-bamboo-400"
                  aria-label="WhatsApp"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
                <a
                  href="https://www.strava.com/clubs/panda-cycling"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-panda-700/50 bg-panda-800/80 text-panda-400 transition hover:border-bamboo-500/30 hover:text-bamboo-400"
                  aria-label="Strava"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Navigation - caché sur mobile */}
            <div className="hidden md:block">
              <h4 className="text-sm font-semibold text-white mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm text-panda-400">
                <li><Link to="/sorties" className="hover:text-bamboo-400 transition">Sorties</Link></li>
                <li><Link to="/kom" className="hover:text-bamboo-400 transition">KOM du mois</Link></li>
                <li><Link to="/evenements" className="hover:text-bamboo-400 transition">Événements</Link></li>
                <li><Link to="/catalog" className="hover:text-bamboo-400 transition">Shop</Link></li>
              </ul>
            </div>

            {/* Contact - caché sur mobile */}
            <div className="hidden md:block">
              <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-panda-400">
                <li>
                  <a
                    href={SOCIAL_LINKS[1].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-bamboo-400 transition"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href={SOCIAL_LINKS[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-bamboo-400 transition"
                  >
                    Instagram
                  </a>
                </li>
                <li className="text-panda-500">Suisse romande</li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-panda-800/50 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-panda-500">
            <span>© {new Date().getFullYear()} Panda Cycling — Tous droits réservés.</span>
            <span className="text-bamboo-400/70">Pleine balle.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
