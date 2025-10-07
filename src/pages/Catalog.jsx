import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { API } from "../lib/api.js";

export default function Catalog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [layout, setLayout] = useState("grid");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let live = true;
    fetch(`${API}/api/catalog/featured`)
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

  const statuses = useMemo(() => {
    const values = new Set();
    items.forEach((item) => {
      if (item?.status) {
        values.add(item.status);
      }
    });
    return Array.from(values);
  }, [items]);

  const filteredItems = useMemo(() => {
    if (statusFilter === "all") return items;
    return items.filter((item) => item?.status === statusFilter);
  }, [items, statusFilter]);

  const renderStatusButton = (status) => {
    const isActive = statusFilter === status;
    return (
      <button
        key={status}
        type="button"
        onClick={() => setStatusFilter(isActive ? "all" : status)}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 ${
          isActive
            ? "border-white/20 bg-white/10 text-white shadow-soft"
            : "border-white/10 bg-neutral-900/60 text-zinc-300 hover:border-white/20 hover:bg-neutral-900"
        }`}
      >
        <span>{status}</span>
        {isActive && (
          <span className="text-xs uppercase tracking-widest text-white/70">Actif</span>
        )}
      </button>
    );
  };

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
              Une sélection limitée d’accessoires pour rouler ou se poser. Filtre par statut et choisis le format d’affichage qui
              te convient.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900/60 p-1">
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

            {statuses.length > 0 && (
              <div className="flex flex-wrap gap-2">{statuses.map((status) => renderStatusButton(status))}</div>
            )}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="glass-panel flex flex-col gap-3 p-6 text-sm text-zinc-300">
            <span>Aucun produit ne correspond à ce filtre.</span>
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
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
