import { Link } from "react-router-dom";
import { useMemo } from "react";
import { API } from "../lib/api.js";
import { formatCurrency, getProductDisplayPrice } from "../lib/pricing.js";

export default function ProductCard({ product, layout = "grid" }) {
  const { id, title, image } = product;
  const preview = image ? `${API}/api/proxy/image?url=${encodeURIComponent(image)}` : null;
  const isList = layout === "list";
  const displayPrice = useMemo(() => getProductDisplayPrice(product), [product]);
  const formattedPrice = useMemo(() => {
    if (!displayPrice) return null;
    return formatCurrency(displayPrice.amount, displayPrice.currency);
  }, [displayPrice]);
  const priceLabel = useMemo(() => {
    if (!formattedPrice) return null;
    return displayPrice?.from ? `Dès ${formattedPrice}` : formattedPrice;
  }, [formattedPrice, displayPrice]);

  const containerClasses = isList
    ? "flex flex-row items-stretch gap-6"
    : "flex h-full flex-col";
  const mediaClasses = isList
    ? "h-32 w-32 flex-shrink-0 overflow-hidden rounded-[1.5rem] sm:h-40 sm:w-40"
    : "h-56 w-full overflow-hidden";

  return (
    <article
      className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-900/60 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-neutral-900 ${containerClasses}`}
    >
      <div
        className={`relative bg-neutral-950 ${mediaClasses}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_70%)] opacity-0 transition duration-500 group-hover:opacity-100" />
        {preview ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              className={`max-h-full max-w-full object-contain ${isList ? "p-4" : "p-6"}`}
              src={preview}
              alt={title}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-zinc-500">
            Pas d’image
          </div>
        )}
        {priceLabel ? (
          <span
            className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg"
          >
            {priceLabel}
          </span>
        ) : (
          <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-300">
            Prix indisponible
          </span>
        )}
      </div>

      <div className={`flex flex-1 flex-col justify-between gap-4 ${isList ? "py-4 pr-4 sm:py-6 sm:pr-6" : "p-6"}`}>
        <div className="space-y-3">
          <h3 className={`text-lg font-semibold leading-snug text-white ${isList ? "line-clamp-2" : ""}`}>
            {title}
          </h3>
          <p className="text-sm text-zinc-400">
            Sélectionne ce produit pour découvrir ses variantes détaillées.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-white/30" aria-hidden="true" />
            <span>Variantes multiples</span>
          </div>
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/15"
            to={`/catalog/${id}`}
          >
            Voir le détail
            <span
              aria-hidden="true"
              className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/20 text-xs"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
