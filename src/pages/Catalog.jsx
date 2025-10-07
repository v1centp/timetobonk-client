import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { API } from "../lib/api.js";
import { getProductDisplayPrice } from "../lib/pricing.js";

const PRICE_FILTERS = [
  { id: "all", label: "Tous les prix", match: () => true },
  { id: "under-30", label: "< 30 CHF", match: (amount) => amount < 30 },
  { id: "30-60", label: "30 – 60 CHF", match: (amount) => amount >= 30 && amount < 60 },
  { id: "60-100", label: "60 – 100 CHF", match: (amount) => amount >= 60 && amount < 100 },
  { id: "over-100", label: "≥ 100 CHF", match: (amount) => amount >= 100 },
];

export default function Catalog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [layout, setLayout] = useState("grid");
  const [priceFilter, setPriceFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let live = true;
    fetch(`${API}/api/catalog/featured?currency=CHF`)
      .then((r) => r.json())
      .then((json) => {
        if (!live) return;
        setItems(json.items || []);
        setLoading(false);
      })
      .catch((e) => {
        if (!live) return;
        setErr(e.message);
        setLoading(false);
      });
    return () => {
      live = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filterConfig = PRICE_FILTERS.find((option) => option.id === priceFilter) ?? PRICE_FILTERS[0];

    return items.filter((item) => {
      const price = getProductDisplayPrice(item);
      const amount = price?.amount;

      if (!price || !Number.isFinite(amount)) {
        return false;
      }

      if (normalizedSearch) {
        const textFields = [item.title, item.description, item.status]
          .filter(Boolean)
          .map((value) => String(value).toLowerCase());
        const matchesSearch = textFields.some((field) => field.includes(normalizedSearch));
        if (!matchesSearch) {
          return false;
        }
      }

      if (filterConfig?.match && !filterConfig.match(amount)) {
        return false;
      }

      return true;
    });
  }, [items, priceFilter, searchTerm]);

  if (loading) {
    return (
      <section className="py-20">
        <div className="container">
          <div className="glass-panel flex items-center justify-between p-6 text-sm text-zinc-300">
            <span>Chargement du catalogue…</span>
            <span className="h-2 w-2 animate-pulse rounded-full bg-white/60" aria-hidden="true" />
          </div>
        </div>
      </section>
    );
  }

  if (err) {
    return (
      <section className="py-20">
        <div className="container">
          <div className="glass-panel p-6 text-sm text-zinc-300">Erreur : {err}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container space-y-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Catalogue</p>
            <h1 className="text-4xl font-semibold text-white">Explore la réserve</h1>
            <p className="max-w-2xl text-base text-zinc-400">
              Une sélection limitée d’accessoires pour rouler ou se poser. Recherche un produit et affine par gamme de prix
              puis choisis le format d’affichage qui te convient.
            </p>
          </div>

          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
              <label className="flex w-full max-w-md items-center gap-3 rounded-full border border-white/10 bg-neutral-900/70 px-4 py-2 text-sm text-zinc-300 focus-within:border-white/20 focus-within:text-white">
                <span aria-hidden="true" className="text-lg leading-none text-zinc-500">
                  🔍
                </span>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Recherche produit…"
                  className="w-full bg-transparent text-sm font-medium text-white placeholder:text-zinc-500 focus:outline-none"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="text-xs uppercase tracking-[0.25em] text-zinc-500 transition hover:text-white"
                  >
                    Effacer
                  </button>
                )}
              </label>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900/70 p-1 sm:ml-auto">
                <button
                  type="button"
                  onClick={() => setLayout("grid")}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    layout === "grid"
                      ? "bg-white/15 text-white shadow-soft"
                      : "text-zinc-300 hover:text-white"
                  }`}
                >
                  <span aria-hidden="true">▦</span>
                  Grille
                </button>
                <button
                  type="button"
                  onClick={() => setLayout("list")}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    layout === "list"
                      ? "bg-white/15 text-white shadow-soft"
                      : "text-zinc-300 hover:text-white"
                  }`}
                >
                  <span aria-hidden="true">☰</span>
                  Liste
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 rounded-3xl border border-white/10 bg-neutral-900/60 p-2 sm:justify-end">
              {PRICE_FILTERS.map((option) => {
                const isActive = priceFilter === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPriceFilter(option.id)}
                    className={`flex min-w-[100px] items-center justify-center rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                      isActive ? "bg-white/15 text-white shadow-soft" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="glass-panel flex flex-col gap-3 p-6 text-sm text-zinc-300">
            <span>Aucun produit ne correspond à cette recherche.</span>
            <button
              type="button"
              onClick={() => {
                setPriceFilter("all");
                setSearchTerm("");
              }}
              className="inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400 transition hover:text-white"
            >
              Réinitialiser
              <span aria-hidden="true">↺</span>
            </button>
          </div>
        ) : (
          <div
            className={
              layout === "grid"
                ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                : "space-y-4"
            }
          >
            {filteredItems.map((product) => (
              <ProductCard key={product.id} product={product} layout={layout} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
