import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API } from "../lib/api.js";
import { useCart } from "../context/CartContext.jsx";
import { formatCurrency, resolveDisplayPrice } from "../lib/pricing.js";

const STATUS_TONES = {
  connected: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  default: "border-white/20 bg-white/10 text-zinc-200",
};

function normalizeStatus(status) {
  if (typeof status !== "string") return "default";
  if (/connected|active|available/i.test(status)) return "connected";
  return "default";
}

export default function ProductDetail() {
  const { id } = useParams();
  const [prod, setProd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [mainImageUrl, setMainImageUrl] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    let live = true;
    setLoading(true);
    fetch(`${API}/api/catalog/product/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Produit introuvable");
        return r.json();
      })
      .then((json) => {
        if (!live) return;
        setProd(json);
        const variants = Array.isArray(json.variants) ? json.variants : [];
        const first = variants.find((v) => v.connectionStatus === "connected") || variants[0] || null;
        setSelectedVariant(first);
        const firstImg =
          json.previewUrl ||
          json.externalPreviewUrl ||
          json.externalThumbnailUrl ||
          (json.productImages?.[0]?.fileUrl ?? null);
        setMainImageUrl(firstImg);
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
  }, [id]);

  const gallery = useMemo(() => {
    if (!prod?.productImages) return [];
    return prod.productImages.map((img) => ({
      id: img.id,
      fileUrl: img.fileUrl,
      variantIds: img.productVariantIds ?? [],
    }));
  }, [prod]);

  const availableVariants = useMemo(() => {
    if (!Array.isArray(prod?.variants)) return [];
    const connected = prod.variants.filter((variant) => variant.connectionStatus === "connected");
    if (connected.length > 0) return connected;
    return prod.variants;
  }, [prod]);

  const imageUrl = (url) => (url ? `${API}/api/proxy/image?url=${encodeURIComponent(url)}` : null);

  const handleQuantityChange = (event) => {
    const n = Number(event.target.value);
    if (!Number.isFinite(n)) return;
    setQuantity(Math.max(1, Math.min(99, Math.floor(n))));
  };

  const incrementQuantity = () => {
    setQuantity((prev) => Math.max(1, Math.min(99, prev + 1)));
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, Math.min(99, prev - 1)));
  };

  const handlePickVariant = (variant) => {
    setSelectedVariant(variant);
    const img = variant?.imageUrl || variant?.fileUrl;
    if (img) setMainImageUrl(img);
  };

  const displayPrice = useMemo(() => {
    if (!prod) return null;
    return resolveDisplayPrice(prod, selectedVariant);
  }, [prod, selectedVariant]);

  const mainImg = imageUrl(mainImageUrl);

  const selectedVariantLabel = useMemo(() => {
    if (!selectedVariant) return null;
    return (
      selectedVariant.title ||
      selectedVariant.name ||
      selectedVariant.variantTitle ||
      selectedVariant.variantName ||
      selectedVariant.sku ||
      null
    );
  }, [selectedVariant]);

  const handleAddToCart = () => {
    if (!prod || !selectedVariant?.productUid) {
      alert("Variante indisponible");
      return;
    }

    const currency = (displayPrice?.currency || prod?.currency || "eur").toLowerCase();
    const variantId = selectedVariant.id || selectedVariant.productUid || selectedVariant.sku || "default";
    const displayTitle = selectedVariantLabel ? `${prod.title} — ${selectedVariantLabel}` : prod.title;

    addItem(
      {
        id: `${prod.id}:${variantId}`,
        productId: prod.id,
        title: displayTitle,
        productTitle: prod.title,
        variantTitle: selectedVariantLabel,
        variantId,
        variantSku: selectedVariant.sku || null,
        productUid: selectedVariant.productUid,
        image: mainImg,
        price: displayPrice?.amount ?? 0,
        currency,
      },
      quantity
    );

    setFeedback("Produit ajouté au panier !");
    setTimeout(() => setFeedback(""), 2200);
  };

  const formattedPrice = useMemo(() => {
    if (!displayPrice) return null;
    return formatCurrency(displayPrice.amount, displayPrice.currency);
  }, [displayPrice]);
  const statusTone = STATUS_TONES[normalizeStatus(prod?.status)] ?? STATUS_TONES.default;

  if (loading) return <p className="text-sm text-zinc-500">Chargement…</p>;
  if (err) return <p className="text-sm text-zinc-500">Erreur : {err}</p>;
  if (!prod) return <p className="text-sm text-zinc-500">Produit introuvable.</p>;

  return (
    <section className="container space-y-10">
      <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
        <Link to="/catalog" className="inline-flex items-center gap-2 text-zinc-300 transition hover:text-white">
          <span aria-hidden="true">←</span>
          Retour au catalogue
        </Link>
        <span className="hidden text-zinc-600 sm:inline">/</span>
        <span className="text-zinc-400">{prod.title}</span>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-neutral-900/60 shadow-soft">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_70%)] opacity-0 transition duration-500 group-hover:opacity-100" />
            {mainImg ? (
              <img src={mainImg} alt={prod.title} className="h-[420px] w-full bg-neutral-950 object-contain" />
            ) : (
              <div className="flex h-[420px] items-center justify-center text-sm text-zinc-500">Pas d’image</div>
            )}
            {prod.status && (
              <span
                className={`absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] ${statusTone}`}
              >
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-white/70" aria-hidden="true" />
                {prod.status}
              </span>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="flex flex-wrap gap-3">
              {gallery.map((img) => {
                const url = imageUrl(img.fileUrl);
                const isActive = mainImageUrl && img.fileUrl === mainImageUrl;
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setMainImageUrl(img.fileUrl)}
                    className={`overflow-hidden rounded-2xl border transition ${
                      isActive
                        ? "border-white/40 bg-white/10"
                        : "border-white/10 bg-neutral-900/70 hover:border-white/20"
                    }`}
                    style={{ width: "84px", height: "84px" }}
                  >
                    {url ? (
                      <img src={url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full items-center justify-center text-[10px] text-zinc-500">—</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-8 lg:pl-6">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">La réserve de la Panda Cycling</p>
            <h1 className="text-4xl font-semibold text-white">{prod.title}</h1>
            {formattedPrice && <p className="text-lg font-medium text-white">{formattedPrice}</p>}
            <p className="text-sm text-zinc-400">Status : {prod.status}</p>
          </div>

          {availableVariants.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-zinc-300">
                  Variante sélectionnée :
                  <span className="font-medium text-white">
                    {" "}
                    {selectedVariantLabel || "—"}
                  </span>
                </p>
                {selectedVariant?.sku && (
                  <span className="rounded-full border border-white/10 bg-neutral-900/60 px-3 py-1 text-xs text-zinc-400">
                    SKU : {selectedVariant.sku}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {availableVariants.map((variant) => {
                  const img = gallery.find((g) => Array.isArray(g.variantIds) && g.variantIds.includes(variant.id));
                  const thumb = imageUrl(img?.fileUrl || variant?.imageUrl || variant?.fileUrl);
                  const active = selectedVariant?.id === variant.id;
                  return (
                    <button
                      key={variant.id || variant.productUid}
                      type="button"
                      onClick={() => handlePickVariant(variant)}
                      className={`group flex w-[120px] flex-col overflow-hidden rounded-2xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 ${
                        active
                          ? "border-white/40 bg-white/10 text-white shadow-soft"
                          : "border-white/10 bg-neutral-900/60 text-zinc-300 hover:border-white/25"
                      }`}
                    >
                      <div className="relative h-20 w-full overflow-hidden">
                        {thumb ? (
                          <img src={thumb} alt={variant.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] text-zinc-500">—</div>
                        )}
                      </div>
                      <span className="px-3 py-2 text-xs font-medium">
                        {variant.title || variant.name || "Variante"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-neutral-900/60 px-3 py-2 text-sm text-zinc-300">
                <span>Quantité</span>
                <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-neutral-900/60 px-1">
                  <button
                    type="button"
                    onClick={decrementQuantity}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-lg text-zinc-300 transition hover:bg-white/10 hover:text-white"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="h-8 w-14 rounded-full border border-transparent bg-transparent text-center text-sm font-semibold text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={incrementQuantity}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-lg text-zinc-300 transition hover:bg-white/10 hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>
              <button type="button" className="btn-primary" onClick={handleAddToCart}>
                Ajouter au panier
              </button>
              <Link className="btn-ghost" to="/catalog">
                Retour
              </Link>
            </div>
            {feedback && (
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
                <span aria-hidden="true">✔</span>
                {feedback}
              </div>
            )}
          </div>

          {Array.isArray(prod?.tags) && prod.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
              {prod.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-neutral-900/60 px-3 py-1">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {prod.description && (
            <div
              className="prose prose-invert max-w-none rounded-3xl border border-white/10 bg-neutral-900/50 px-6 py-5"
              dangerouslySetInnerHTML={{ __html: prod.description }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
