import { Link } from "react-router-dom";
import { useMemo } from "react";
import { API } from "../lib/api.js";
import { formatCurrency, getProductDisplayPrice } from "../lib/pricing.js";
import capImage from "../assets/cap.png";
import mugImage from "../assets/mug.png";
import beanieImage from "../assets/new_beanie.png";
import pompomImage from "../assets/pompom_new.png";
import socksImage from "../assets/socks.png";

// Images locales pour certains produits (par titre ou par ID)
const LOCAL_IMAGES = {
  "Vintage Cap| Black": capImage,
  "Mug Inox | Bamboo Vibes": mugImage,
  "Cuffed Beanie | Black": beanieImage,
  "Pom Pom Beanie | Black": pompomImage,
};

// Images locales par marqueur LOCAL:
const LOCAL_IMAGE_FILES = {
  "socks.png": socksImage,
};

function resolveLocalImage(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return null;
  if (imageUrl.startsWith("LOCAL:")) {
    const filename = imageUrl.replace("LOCAL:", "");
    return LOCAL_IMAGE_FILES[filename] || null;
  }
  return null;
}

export default function ProductCard({ product, layout = "grid" }) {
  const { id, title, image } = product;
  const localImage = LOCAL_IMAGES[title] || resolveLocalImage(image);
  const preview = localImage || (image && !image.startsWith("LOCAL:") ? `${API}/api/proxy/image?url=${encodeURIComponent(image)}` : null);
  const isList = layout === "list";
  const displayPrice = useMemo(() => getProductDisplayPrice(product), [product]);
  const priceLabel = useMemo(() => {
    if (!displayPrice) return null;
    return formatCurrency(displayPrice.amount, displayPrice.currency);
  }, [displayPrice]);

  const containerClasses = isList
    ? "flex flex-row items-stretch gap-6"
    : "flex h-full flex-col";
  const mediaClasses = isList
    ? "h-32 w-32 flex-shrink-0 overflow-hidden rounded-[1.5rem] sm:h-40 sm:w-40"
    : "h-56 w-full overflow-hidden";
  const detailHref = `/catalog/${id}`;

  return (
    <article
      className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-900/60 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-neutral-900 ${containerClasses}`}
    >
      <Link
        to={detailHref}
        className={`relative bg-neutral-950 ${mediaClasses}`}
        aria-label={`Voir ${title}`}
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
      </Link>

      <div className={`flex flex-1 flex-col justify-between gap-4 ${isList ? "py-4 pr-4 sm:py-6 sm:pr-6" : "p-6"}`}>
        <h3 className={`text-lg font-semibold leading-snug text-white ${isList ? "line-clamp-2" : ""}`}>
          {title}
        </h3>

        <Link
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/15"
          to={detailHref}
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
    </article>
  );
}
