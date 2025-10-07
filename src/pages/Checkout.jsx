import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const getStripe = (() => {
  let stripePromise;
  return () => {
    if (stripePromise) return stripePromise;

    const publicKey = import.meta.env.VITE_API_URL;
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

function formatCurrency(amount, currency = "EUR") {
  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export default function Checkout() {
  const { items, subtotal, totalQuantity, currency, removeItem, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const success = query.get("success");
  const canceled = query.get("canceled");

  useEffect(() => {
    if (success) {
      clearCart();
    }
  }, [success, clearCart]);

  const handleCheckout = async () => {
    if (!items.length) return;

    setLoading(true);
    setError("");

    try {
      const stripe = await getStripe();
      if (!stripe) {
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
            quantity: i.quantity,
          })),
          successUrl: `${window.location.origin}/checkout?success=true`,
          cancelUrl: `${window.location.origin}/checkout?canceled=true`,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Impossible de créer la session de paiement.");
      }

      const data = await response.json();

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

  const summaryCurrency = currency?.toUpperCase?.() || "EUR";
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
            Paiement confirmé ! Merci pour ta commande.
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
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="glass-panel flex flex-col gap-5 p-5 sm:flex-row sm:items-center"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-32 w-full rounded-2xl object-cover sm:h-24 sm:w-24"
                  />
                ) : (
                  <div className="flex h-32 w-full items-center justify-center rounded-2xl border border-white/10 text-xs text-zinc-500 sm:h-24 sm:w-24">
                    Pas d'image
                  </div>
                )}

                <div className="flex-1 space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                    <span className="text-sm text-zinc-400">
                      Prix unitaire : {formatCurrency(item.price, item.currency)}
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
            ))}
          </div>

          <aside className="glass-panel space-y-5 p-6">
            <div className="space-y-1 text-sm text-zinc-300">
              <h2 className="text-xl font-semibold text-white">Résumé</h2>
              <p>Articles : {totalQuantity}</p>
              <p>Sous-total : {formatCurrency(subtotal, summaryCurrency)}</p>
              <p className="text-xs text-zinc-500">Frais de livraison calculés lors du paiement.</p>
            </div>

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
              {loading ? "Redirection en cours…" : "Payer avec Stripe"}
            </button>

            {!hasItems && (
              <Link className="btn-ghost w-full" to="/catalog">
                Continuer mes achats
              </Link>
            )}
          </aside>
        </div>
      )}
    </section>
  );
}
