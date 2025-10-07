import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";


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

      const response = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({
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

  return (
    <section className="container space-y-6 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Panier</h1>
        <p className="text-sm text-zinc-400">Retrouve ici les produits ajoutés à ton panier.</p>
      </div>

      {success && (
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4 text-sm text-zinc-200">
          Paiement confirmé ! Merci pour ta commande.
        </div>
      )}

      {canceled && !success && (
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4 text-sm text-zinc-200">
          Le paiement a été annulé. Tu peux réessayer quand tu veux.
        </div>
      )}

      {!items.length && !success ? (
        <div className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 text-sm text-zinc-300">
          <p>Ton panier est vide pour le moment.</p>
          <Link className="btn btn-primary w-full sm:w-auto" to="/catalog">
            Parcourir le catalogue
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 sm:flex-row sm:items-center"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-32 w-32 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-xl border border-neutral-800 text-xs text-zinc-500">
                    Pas d'image
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                  <p className="text-sm text-zinc-400">Prix unitaire : {formatCurrency(item.price, item.currency)}</p>

                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-zinc-300">
                      <span>Quantité</span>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={item.quantity}
                        onChange={(event) => handleQuantityChange(item.id, event.target.value)}
                        className="w-16 rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm text-white"
                      />
                    </label>
                    <button
                      type="button"
                      className="btn btn-ghost hover:border-neutral-500"
                      onClick={() => removeItem(item.id)}
                    >
                      Retirer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5">
            <h2 className="text-xl font-semibold text-white">Résumé</h2>
            <div className="space-y-1 text-sm text-zinc-300">
              <p>Articles : {totalQuantity}</p>
              <p>Sous-total : {formatCurrency(subtotal, summaryCurrency)}</p>
            </div>

            {error && <p className="text-sm text-zinc-200">{error}</p>}

            <button
              type="button"
              className="btn btn-primary w-full"
              onClick={handleCheckout}
              disabled={!items.length || loading}
            >
              {loading ? "Redirection en cours…" : "Payer avec Stripe"}
            </button>

            {!items.length && (
              <Link className="btn btn-ghost w-full hover:border-neutral-500" to="/catalog">
                Continuer mes achats
              </Link>
            )}
          </aside>
        </div>
      )}
    </section>
  );
}
