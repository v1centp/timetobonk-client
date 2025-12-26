import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { API } from "../lib/api.js";
import { getProductDisplayPrice } from "../lib/pricing.js";

const ITEMS_PER_PAGE = 12;

export default function Catalog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [layout, setLayout] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let live = true;
    fetch(`${API}/api/catalog/featured?currency=CHF&limit=60&page=1`)
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

      return true;
    });
  }, [items, searchTerm]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE)), [filteredItems.length]);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, items]);

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
            <h1 className="text-4xl font-semibold text-white">Le shop Panda</h1>
            <p className="max-w-2xl text-base text-zinc-400">
              Une sélection d'accessoires aux couleurs du club. Les bénéfices financent nos activités et événements.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900/70 p-1">
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
        </div>

        {filteredItems.length === 0 ? (
          <div className="glass-panel flex flex-col gap-3 p-6 text-sm text-zinc-300">
            <span>Aucun produit ne correspond à cette recherche.</span>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
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
            {paginatedItems.map((product) => (
              <ProductCard key={product.id} product={product} layout={layout} />
            ))}
          </div>
        )}

        {filteredItems.length > ITEMS_PER_PAGE && (
          <div className="flex flex-col items-center gap-3 pt-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
              Page {currentPage} / {totalPages}
            </div>
            <div className="inline-flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  currentPage === 1
                    ? "cursor-not-allowed border-white/5 text-zinc-600"
                    : "border-white/10 text-zinc-300 hover:border-white/20 hover:text-white"
                }`}
              >
                Précédent
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  currentPage === totalPages
                    ? "cursor-not-allowed border-white/5 text-zinc-600"
                    : "border-white/10 text-zinc-300 hover:border-white/20 hover:text-white"
                }`}
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
