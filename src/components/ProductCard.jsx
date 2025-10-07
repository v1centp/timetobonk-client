import { Link } from "react-router-dom";
import { API } from "../lib/api.js";

const STATUS_STYLES = [
  {
    match: (status) => /connected|active|available/i.test(status || ""),
    classes: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  },
  {
    match: (status) => /draft|pending|processing/i.test(status || ""),
    classes: "border-amber-300/30 bg-amber-300/10 text-amber-200",
  },
  {
    match: () => true,
    classes: "border-white/20 bg-white/10 text-zinc-200",
  },
];

function getStatusClasses(status) {
  const entry = STATUS_STYLES.find((item) => item.match(status));
  return entry?.classes ?? STATUS_STYLES[STATUS_STYLES.length - 1].classes;
}

export default function ProductCard({ product, layout = "grid" }) {
  const { id, title, image, status } = product;
  const preview = image ? `${API}/api/proxy/image?url=${encodeURIComponent(image)}` : null;
  const statusClasses = getStatusClasses(status);
  const isList = layout === "list";

  return (
    <article
      className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-900/60 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-neutral-900 ${
        isList ? "flex flex-col sm:flex-row" : "flex h-full flex-col"
      }`}
    >
      <div
        className={`relative overflow-hidden ${
          isList
            ? "h-52 w-full sm:h-auto sm:w-52"
            : "h-56 w-full"
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_70%)] opacity-0 transition duration-500 group-hover:opacity-100" />
        {preview ? (
          <img className="h-full w-full object-cover" src={preview} alt={title} />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-zinc-500">Pas d’image</div>
        )}
        {status && (
          <span
            className={`absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${statusClasses}`}
          >
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-white/60" aria-hidden="true" />
            {status}
          </span>
        )}
      </div>

      <div className={`flex flex-1 flex-col justify-between gap-6 ${isList ? "p-6 sm:p-8" : "p-6"}`}>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold leading-snug text-white">{title}</h3>
          <p className="text-sm text-zinc-400">Sélectionne ce produit pour découvrir ses variantes détaillées.</p>
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
