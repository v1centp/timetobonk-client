import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatCurrency } from "../lib/pricing.js";
import { API } from "../lib/api.js";
import socksImage from "../assets/socks.png";
import maillotImage from "../assets/maillot.png";
import maillot2Image from "../assets/maillot2.png";

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

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

const getStripe = (() => {
  let stripePromise;
  return () => {
    if (stripePromise) return stripePromise;

    const publicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    if (!publicKey || typeof window === "undefined") {
      return Promise.resolve(null);
    }

    if (window.Stripe) {
      stripePromise = Promise.resolve(window.Stripe(publicKey));
      return stripePromise;
    }

    stripePromise = new Promise((resolve, reject) => {
      const scriptUrl = "https://js.stripe.com/v3";
      const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);

      const handleLoad = () => {
        if (window.Stripe) {
          resolve(window.Stripe(publicKey));
        } else {
          stripePromise = null;
          reject(new Error("Stripe n'a pas pu être initialisé."));
        }
      };

      const handleError = () => {
        stripePromise = null;
        reject(new Error("Impossible de charger Stripe.js"));
      };

      if (existingScript) {
        if (window.Stripe) {
          resolve(window.Stripe(publicKey));
          return;
        }
        existingScript.addEventListener("load", handleLoad, { once: true });
        existingScript.addEventListener("error", handleError, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = scriptUrl;
      script.async = true;
      script.onload = handleLoad;
      script.onerror = handleError;
      script.dataset.stripeLoader = "true";
      document.head.appendChild(script);
    });

    return stripePromise;
  };
})();

function toProxyImage(url) {
  if (!url || typeof url !== "string") return null;
  if (url.startsWith("LOCAL:")) return null; // Géré par resolveLocalImage
  if (url.includes("/api/proxy/image")) return url;
  if (!API) return url;
  return `${API}/api/proxy/image?url=${encodeURIComponent(url)}`;
}

export default function Checkout() {
  const { items, subtotal, totalQuantity, currency, removeItem, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoStatus, setPromoStatus] = useState(null); // null | "valid" | "invalid"
  const [promoDiscount, setPromoDiscount] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [shipping, setShipping] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "CH",
  });
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const success = query.get("success");
  const canceled = query.get("canceled");

  useEffect(() => {
    if (success) {
      clearCart();
    }
  }, [success, clearCart]);

  const validatePromo = async () => {
    if (!promoCode.trim()) return;

    setPromoLoading(true);
    setPromoStatus(null);
    setPromoDiscount(null);

    try {
      const response = await fetch(`${API_BASE}/api/payments/validate-promo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode }),
      });

      const data = await response.json();

      if (data.valid) {
        setPromoStatus("valid");
        setPromoDiscount(data.discount);
      } else {
        setPromoStatus("invalid");
      }
    } catch {
      setPromoStatus("invalid");
    } finally {
      setPromoLoading(false);
    }
  };

  const isFreeOrder = promoStatus === "valid" && promoDiscount?.value === 100;

  const handleCheckout = async () => {
    if (!items.length) return;

    // Validation pour commande gratuite
    if (isFreeOrder) {
      if (!shipping.name || !shipping.email || !shipping.address || !shipping.city || !shipping.postalCode) {
        setError("Merci de remplir tous les champs de livraison.");
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      const stripe = await getStripe();
      if (!stripe && !isFreeOrder) {
        throw new Error("La clé publique Stripe n'est pas configurée.");
      }

      const response = await fetch(`${API_BASE}/api/payments/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productUid: i.productUid,
            title: i.title,
            image: i.image,
            imageOriginal: i.imageOriginal,
            quantity: i.quantity,
            unitAmount: i.price,
            currency: i.currency,
          })),
          currency: "CHF",
          promoCode: promoStatus === "valid" ? promoCode : undefined,
          shipping: isFreeOrder ? shipping : undefined,
          successUrl: `${window.location.origin}/checkout?success=true`,
          cancelUrl: `${window.location.origin}/checkout?canceled=true`,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Impossible de créer la session de paiement.");
      }

      const data = await response.json();

      // Si commande gratuite avec code promo
      if (data.free && data.url) {
        window.location.href = data.url;
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: data.id });
      if (stripeError) {
        throw new Error(stripeError.message || "La redirection vers Stripe a échoué.");
      }
    } catch (checkoutError) {
      setError(checkoutError.message || "Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (id, value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return;
    updateQuantity(id, numeric);
  };

  const summaryCurrency = currency?.toUpperCase?.() || "CHF";
  const hasItems = items.length > 0;

  return (
    <section className="container space-y-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Checkout</p>
          <h1 className="text-4xl font-semibold text-white">Panier</h1>
          <p className="text-sm text-zinc-400">Finalise ta sélection avant de passer au paiement sécurisé.</p>
        </div>
        <Link to="/catalog" className="btn-ghost w-full sm:w-auto">
          Continuer mes achats
        </Link>
      </div>

      <div className="space-y-4">
        {success && (
          <div className="glass-panel border-emerald-400/30 bg-emerald-400/10 p-5 text-sm text-emerald-100">
            <p>Paiement confirmé ! Merci pour ta commande.</p>
            <p className="mt-2 text-emerald-200/80">Un email de confirmation t'a été envoyé.</p>
          </div>
        )}

        {canceled && !success && (
          <div className="glass-panel border-amber-300/30 bg-amber-300/10 p-5 text-sm text-amber-100">
            Le paiement a été annulé. Tu peux réessayer quand tu veux.
          </div>
        )}
      </div>

      {!hasItems && !success ? (
        <div className="glass-panel flex flex-col items-start gap-4 p-8 text-sm text-zinc-300">
          <p>Ton panier est vide pour le moment.</p>
          <Link className="btn-primary" to="/catalog">
            Parcourir le catalogue
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 pb-24 lg:grid-cols-[1.2fr_0.8fr] lg:pb-0">
          <div className="space-y-4">
            {items.map((item) => {
              const productTitle = item.productTitle || item.title;
              const variantTitle = item.variantTitle && item.variantTitle !== productTitle ? item.variantTitle : null;
              const displayTitle = item.title || productTitle;
              const localImg = resolveLocalImage(item.image);
              const itemImage = localImg || (item.image && !item.image.startsWith("LOCAL:") ? item.image : null) || toProxyImage(item.imageOriginal || item.originalImage);
              const unitPrice = Number.isFinite(item.price) ? item.price : 0;
              const lineTotal = Number((unitPrice * item.quantity).toFixed(2));
              const unitPriceLabel = formatCurrency(unitPrice, item.currency);
              const lineTotalLabel = formatCurrency(lineTotal, item.currency);

              return (
                <div
                  key={item.id}
                  className="glass-panel flex flex-col gap-5 p-5 sm:flex-row sm:items-center"
                >
                  {itemImage ? (
                    <div className="flex h-32 w-full items-center justify-center rounded-2xl bg-neutral-950 sm:h-24 sm:w-24">
                      <img
                        src={itemImage}
                        alt={displayTitle}
                        className="max-h-full max-w-full object-contain p-3"
                      />
                    </div>
                  ) : (
                    <div className="flex h-32 w-full items-center justify-center rounded-2xl border border-white/10 text-xs text-zinc-500 sm:h-24 sm:w-24">
                      Pas d'image
                    </div>
                  )}

                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <h2 className="text-lg font-semibold text-white">{productTitle}</h2>
                        {variantTitle && (
                          <p className="text-sm text-zinc-400">Variante : {variantTitle}</p>
                        )}
                      </div>
                      <span className="text-sm text-zinc-300">
                        Prix total : {lineTotalLabel}
                        <span className="block text-xs text-zinc-500">
                          soit {unitPriceLabel} / unité
                        </span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-300">
                      <label className="flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900/60 px-3 py-2">
                        <span>Quantité</span>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={item.quantity}
                          onChange={(event) => handleQuantityChange(item.id, event.target.value)}
                          className="w-16 rounded-full border border-transparent bg-transparent text-center text-sm font-semibold text-white focus:outline-none"
                        />
                      </label>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-200 transition hover:border-white/20 hover:bg-white/5"
                        onClick={() => removeItem(item.id)}
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="glass-panel space-y-5 p-6">
            <div className="space-y-1 text-sm text-zinc-300">
              <h2 className="text-xl font-semibold text-white">Résumé</h2>
              <p>Articles : {totalQuantity}</p>
              <p>Sous-total : {formatCurrency(subtotal, summaryCurrency)}</p>
              {promoStatus === "valid" && promoDiscount?.value > 0 && (
                <p className="font-semibold text-emerald-400">
                  Réduction : -{promoDiscount.value}%{promoDiscount.value === 100 ? " (GRATUIT)" : ""}
                </p>
              )}
              <p className="text-xs text-zinc-500">Frais de livraison inclus dans les montants affichés.</p>
            </div>

            {/* Code promo */}
            <div className="space-y-2">
              <label className="text-sm text-zinc-300">Code promo</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase());
                    setPromoStatus(null);
                    setPromoDiscount(null);
                  }}
                  placeholder="Entrer un code"
                  className="flex-1 rounded-full border border-white/10 bg-neutral-900/60 px-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-white/20 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={validatePromo}
                  disabled={!promoCode.trim() || promoLoading}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-50"
                >
                  {promoLoading ? "..." : "Appliquer"}
                </button>
              </div>
              {promoStatus === "valid" && (
                <p className="text-sm text-emerald-400">Code promo valide !</p>
              )}
              {promoStatus === "invalid" && (
                <p className="text-sm text-red-400">Code promo invalide</p>
              )}
            </div>

            {/* Formulaire livraison pour commande gratuite */}
            {isFreeOrder && (
              <div className="space-y-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                <p className="text-sm font-medium text-emerald-400">Adresse de livraison</p>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Nom complet *"
                  value={shipping.name}
                  onChange={(e) => setShipping((s) => ({ ...s, name: e.target.value }))}
                  onBlur={(e) => setShipping((s) => ({ ...s, name: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-neutral-900/60 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-white/20 focus:outline-none"
                />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Email *"
                  value={shipping.email}
                  onChange={(e) => setShipping((s) => ({ ...s, email: e.target.value }))}
                  onBlur={(e) => setShipping((s) => ({ ...s, email: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-neutral-900/60 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-white/20 focus:outline-none"
                />
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  placeholder="Téléphone"
                  value={shipping.phone}
                  onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
                  onBlur={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-neutral-900/60 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-white/20 focus:outline-none"
                />
                <input
                  type="text"
                  name="address"
                  autoComplete="street-address"
                  placeholder="Adresse *"
                  value={shipping.address}
                  onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))}
                  onBlur={(e) => setShipping((s) => ({ ...s, address: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-neutral-900/60 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-white/20 focus:outline-none"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="postalCode"
                    autoComplete="postal-code"
                    placeholder="NPA *"
                    value={shipping.postalCode}
                    onChange={(e) => setShipping((s) => ({ ...s, postalCode: e.target.value }))}
                    onBlur={(e) => setShipping((s) => ({ ...s, postalCode: e.target.value }))}
                    className="w-24 rounded-lg border border-white/10 bg-neutral-900/60 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-white/20 focus:outline-none"
                  />
                  <input
                    type="text"
                    name="city"
                    autoComplete="address-level2"
                    placeholder="Ville *"
                    value={shipping.city}
                    onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
                    onBlur={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
                    className="flex-1 rounded-lg border border-white/10 bg-neutral-900/60 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-white/20 focus:outline-none"
                  />
                </div>
                <select
                  name="country"
                  autoComplete="country"
                  value={shipping.country}
                  onChange={(e) => setShipping((s) => ({ ...s, country: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-neutral-900/60 px-3 py-2 text-sm text-white focus:border-white/20 focus:outline-none"
                >
                  <option value="CH">Suisse</option>
                  <option value="FR">France</option>
                  <option value="DE">Allemagne</option>
                  <option value="AT">Autriche</option>
                  <option value="IT">Italie</option>
                  <option value="BE">Belgique</option>
                </select>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
                {error}
              </div>
            )}

            <button
              type="button"
              className="btn-primary w-full"
              onClick={handleCheckout}
              disabled={!hasItems || loading}
            >
              {loading ? "Redirection en cours…" : promoStatus === "valid" && promoDiscount?.value === 100 ? "Confirmer (gratuit)" : "Payer avec Stripe"}
            </button>

            {!hasItems && (
              <Link className="btn-ghost w-full" to="/catalog">
                Continuer mes achats
              </Link>
            )}
          </aside>
        </div>
      )}

      {/* Barre sticky mobile */}
      {hasItems && !success && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-panda-900/95 p-4 backdrop-blur-lg lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm">
              <p className="text-zinc-400">{totalQuantity} article{totalQuantity > 1 ? "s" : ""}</p>
              <p className="text-lg font-semibold text-white">
                {formatCurrency(subtotal, summaryCurrency)}
                {promoStatus === "valid" && promoDiscount?.value > 0 && (
                  <span className="ml-2 text-sm font-normal text-emerald-400">-{promoDiscount.value}%</span>
                )}
              </p>
            </div>
            <button
              type="button"
              className="btn-primary px-6"
              onClick={handleCheckout}
              disabled={!hasItems || loading}
            >
              {loading ? "..." : isFreeOrder ? "Confirmer" : "Payer"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
