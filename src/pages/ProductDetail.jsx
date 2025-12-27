import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API } from "../lib/api.js";
import { useCart } from "../context/CartContext.jsx";
import { formatCurrency, inferCurrency, parseAmount } from "../lib/pricing.js";
import capImage from "../assets/cap.png";
import mugImage from "../assets/mug.png";
import beanieImage from "../assets/new_beanie.png";
import pompomImage from "../assets/pompom_new.png";
import socksImage from "../assets/socks.png";
import maillotImage from "../assets/maillot.png";
import maillot2Image from "../assets/maillot2.png";

// Images locales pour certains produits
const LOCAL_IMAGES = {
  "Vintage Cap| Black": capImage,
  "Mug Inox | Bamboo Vibes": mugImage,
  "Cuffed Beanie | Black": beanieImage,
  "Pom Pom Beanie | Black": pompomImage,
};

// Images locales par marqueur LOCAL:
const LOCAL_IMAGE_FILES = {
  "socks.png": socksImage,
  "maillot.png": maillotImage,
  "maillot2.png": maillot2Image,
};

function resolveLocalImage(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return null;
  if (imageUrl.startsWith("LOCAL:")) {
    const filename = imageUrl.replace("LOCAL:", "");
    return LOCAL_IMAGE_FILES[filename] || null;
  }
  return null;
}

function normalizePrice(source, fallbackCurrency = "EUR") {
  if (source == null) return null;

  const candidates = [];
  if (typeof source === "object") {
    candidates.push(
      source.amount,
      source.unitAmount,
      source.value,
      source.price,
      source.unitPrice,
      source.total
    );
    if (source.raw) {
      candidates.push(source.raw.unitAmount, source.raw.unitPrice, source.raw.price);
    }
  } else {
    candidates.push(source);
  }

  let amount = null;
  for (const candidate of candidates) {
    const parsed = parseAmount(candidate);
    if (parsed !== null) {
      amount = parsed;
      break;
    }
  }
  if (amount === null) return null;

  const currency =
    typeof source === "object" && source !== null
      ? inferCurrency(source, fallbackCurrency)
      : fallbackCurrency;

  const quantityCandidate =
    (typeof source === "object" && source !== null && (
      source.quantity ??
      source.qty ??
      source.minimumQuantity ??
      source.minQuantity ??
      source.raw?.quantity ??
      source.raw?.qty ??
      source.raw?.minimumQuantity ??
      source.raw?.minQuantity
    )) ??
    null;
  const quantity = Number(quantityCandidate);

  let total = null;
  if (typeof source === "object" && source !== null) {
    const totalCandidates = [
      source.total,
      source.valueTotal,
      source.raw?.total,
      source.raw?.totalAmount,
      source.raw?.totalPrice,
      source.raw?.price,
    ];
    for (const candidate of totalCandidates) {
      const parsed = parseAmount(candidate);
      if (parsed !== null) {
        total = parsed;
        break;
      }
    }
  }

  return {
    amount,
    currency,
    quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : null,
    total,
  };
}

function resolveProductUid(product, variant, fallback) {
  if (variant?.productUid) return variant.productUid;
  if (product?.product?.productUid) return product.product.productUid;
  if (product?.productUid) return product.productUid;
  if (variant?.id) return variant.id;
  if (product?.id) return product.id;
  return fallback ?? null;
}

function resolveVariantImage(variant) {
  if (!variant) return null;
  return (
    variant.imageUrl ||
    variant.fileUrl ||
    variant.previewUrl ||
    variant.previewImage ||
    variant.image ||
    variant.media?.[0]?.url ||
    variant.assets?.[0]?.fileUrl ||
    null
  );
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
  const [defaultImage, setDefaultImage] = useState(null);
  const [priceInfo, setPriceInfo] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceErr, setPriceErr] = useState("");
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
        setPriceErr("");
        setPriceInfo(normalizePrice(json.price, inferCurrency(json, "CHF")));
        setPriceLoading(false);
        const variants = Array.isArray(json.variants) ? json.variants : [];
        const first = variants.find((v) => v.connectionStatus === "connected") || variants[0] || null;
        setSelectedVariant(first);
        const fallbackImage =
          json.previewUrl ||
          json.externalPreviewUrl ||
          json.externalThumbnailUrl ||
          json.thumbnailUrl ||
          (json.productImages?.[0]?.fileUrl ?? null);
        setDefaultImage(fallbackImage || null);
        setMainImageUrl(fallbackImage || null);
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

  const availableVariants = useMemo(() => {
    if (!Array.isArray(prod?.variants)) return [];
    const connected = prod.variants.filter((variant) => variant.connectionStatus === "connected");
    if (connected.length > 0) return connected;
    return prod.variants;
  }, [prod]);

  const variantImageMap = useMemo(() => {
    const map = new Map();
    if (Array.isArray(prod?.productImages)) {
      prod.productImages.forEach((img) => {
        if (!img?.fileUrl) return;
        const addKey = (key) => {
          if (key === undefined || key === null) return;
          const str = String(key);
          map.set(str, img.fileUrl);
          if (typeof str === "string") {
            map.set(str.toLowerCase(), img.fileUrl);
          }
        };

        if (Array.isArray(img.productVariantIds)) {
          img.productVariantIds.forEach(addKey);
        }
        if (Array.isArray(img.productVariantUids)) {
          img.productVariantUids.forEach(addKey);
        }
        addKey(img.productVariantId);
        addKey(img.productVariantUid);
        addKey(img.productVariantSku);
      });
    }
    return map;
  }, [prod]);

  const getVariantImage = useCallback(
    (variant) => {
      if (!variant) return null;
      const candidates = [
        variant.id,
        variant.productUid,
        typeof variant.productUid === "string" ? variant.productUid.toLowerCase() : null,
        variant.sku,
        typeof variant.sku === "string" ? variant.sku.toLowerCase() : null,
      ].filter((value) => value !== undefined && value !== null);

      for (const candidate of candidates) {
        const key = String(candidate);
        if (variantImageMap.has(key)) {
          return variantImageMap.get(key);
        }
      }

      return resolveVariantImage(variant);
    },
    [variantImageMap]
  );

  const fallbackCurrency = useMemo(() => inferCurrency(prod, "CHF"), [prod]);
  const productUid = useMemo(() => resolveProductUid(prod, selectedVariant, id), [prod, selectedVariant, id]);

  useEffect(() => {
    if (!selectedVariant) {
      if (defaultImage) setMainImageUrl(defaultImage);
      return;
    }
    const variantImage = getVariantImage(selectedVariant);
    if (variantImage) {
      setMainImageUrl(variantImage);
    } else if (defaultImage) {
      setMainImageUrl(defaultImage);
    }
  }, [selectedVariant, defaultImage, getVariantImage]);

  useEffect(() => {
    if (!prod || !productUid) return;

    let cancelled = false;
    const controller = new AbortController();

    setPriceLoading(true);
    setPriceErr("");

    const params = new URLSearchParams();
    params.set("qty", String(quantity));
    if (fallbackCurrency) {
      params.set("currency", fallbackCurrency);
    }

    fetch(`${API}/api/catalog/product/${encodeURIComponent(productUid)}/price?${params.toString()}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Impossible de récupérer le prix pour cette configuration.");
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        setPriceInfo(
          normalizePrice(
            {
              amount: json.unitAmount,
              unitAmount: json.unitAmount,
              total: json.total,
              quantity: json.quantity,
              currency: json.currency,
            },
            fallbackCurrency
          )
        );
        setPriceLoading(false);
      })
      .catch((error) => {
        if (cancelled || error.name === "AbortError") return;
        setPriceErr(error.message);
        setPriceLoading(false);
        setPriceInfo((prev) => prev ?? normalizePrice(prod.price, fallbackCurrency));
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [prod, productUid, quantity, fallbackCurrency]);

  const imageUrl = (url) => (url ? `${API}/api/proxy/image?url=${encodeURIComponent(url)}` : null);
  const localImage = prod?.title ? (LOCAL_IMAGES[prod.title] || resolveLocalImage(prod.image)) : resolveLocalImage(prod?.image);

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
  };

  const mainImg = localImage || resolveLocalImage(mainImageUrl) || (mainImageUrl && !mainImageUrl.startsWith("LOCAL:") ? imageUrl(mainImageUrl) : null);

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
    if (!prod || !productUid) {
      alert("Variante indisponible");
      return;
    }

    const currency = (priceInfo?.currency || fallbackCurrency || "eur").toLowerCase();
    const variantId =
      selectedVariant?.id || selectedVariant?.productUid || selectedVariant?.sku || productUid;
    const displayTitle = selectedVariantLabel ? `${prod.title} — ${selectedVariantLabel}` : prod.title;

    addItem(
      {
        id: `${prod.id}:${variantId}`,
        productId: prod.id,
        title: displayTitle,
        productTitle: prod.title,
        variantTitle: selectedVariantLabel,
        variantId,
        variantSku: selectedVariant?.sku || null,
        productUid,
        image: mainImg,
        imageOriginal: mainImageUrl,
        price: priceInfo?.amount ?? 0,
        currency,
      },
      quantity
    );

    setFeedback("Produit ajouté au panier !");
    setTimeout(() => setFeedback(""), 2200);
  };

  const formattedPrice = useMemo(() => {
    if (!priceInfo) return null;
    return formatCurrency(priceInfo.amount, priceInfo.currency);
  }, [priceInfo]);

  const formattedTotalPrice = useMemo(() => {
    if (!priceInfo || !priceInfo.total || !priceInfo.quantity || priceInfo.quantity <= 1) return null;
    return formatCurrency(priceInfo.total, priceInfo.currency);
  }, [priceInfo]);

  if (loading) {
    return (
      <section className="container py-20">
        <div className="glass-panel flex items-center justify-between p-6 text-sm text-zinc-300">
          <span>Chargement du produit…</span>
          <span className="h-2 w-2 animate-pulse rounded-full bg-white/60" aria-hidden="true" />
        </div>
      </section>
    );
  }

  if (err) {
    return (
      <section className="container py-20">
        <div className="glass-panel p-6 text-sm text-zinc-300">Erreur : {err}</div>
      </section>
    );
  }

  if (!prod) {
    return (
      <section className="container py-20">
        <div className="glass-panel p-6 text-sm text-zinc-300">Produit introuvable.</div>
      </section>
    );
  }

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
          </div>
        </div>

        <div className="space-y-8 lg:pl-6">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">La réserve de la Panda Cycling</p>
            <h1 className="text-4xl font-semibold text-white">{prod.title}</h1>
            <div className="space-y-1">
              {priceLoading && <p className="text-sm text-zinc-400">Calcul du prix…</p>}
              {!priceLoading && formattedPrice && (
                <p className="text-lg font-medium text-white">{formattedPrice}</p>
              )}
              {!priceLoading && !formattedPrice && !priceErr && (
                <p className="text-sm text-zinc-400">Prix indisponible pour cette configuration.</p>
              )}
              {formattedTotalPrice && priceInfo?.quantity && (
                <p className="text-xs text-zinc-400">
                  Pack de {priceInfo.quantity} : {formattedTotalPrice}
                </p>
              )}
              {priceErr && <p className="text-xs text-amber-300">{priceErr}</p>}
            </div>
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
                  const variantImage = getVariantImage(variant);
                  const thumb = imageUrl(variantImage || defaultImage);
                  const active =
                    (!!selectedVariant?.id && selectedVariant.id === variant.id) ||
                    (!!selectedVariant?.productUid && selectedVariant.productUid === variant.productUid);
                  return (
                    <button
                      key={variant.id || variant.productUid}
                      type="button"
                      onClick={() => handlePickVariant(variant)}
                      className={`group flex w-[120px] flex-col overflow-hidden rounded-2xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 ${active
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
