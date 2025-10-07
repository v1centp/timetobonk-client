import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API } from "../lib/api.js";
import { useCart } from "../context/CartContext.jsx";

export default function ProductDetail() {
   const { id } = useParams();
   const [prod, setProd] = useState(null);
   const [loading, setLoading] = useState(true);
   const [err, setErr] = useState("");
   const [quantity, setQuantity] = useState(1);
   const [feedback, setFeedback] = useState("");
   const { addItem } = useCart();

   useEffect(() => {
      let live = true;
      fetch(`${API}/api/catalog/product/${id}`)
         .then(r => {
            if (!r.ok) throw new Error("Produit introuvable");
            return r.json();
         })
         .then(json => { if (live) { setProd(json); setLoading(false); } })
         .catch(e => { if (live) { setErr(e.message); setLoading(false); } });
      return () => { live = false; };
   }, [id]);

   const displayPrice = useMemo(() => {
      if (!prod) return null;

      const priceCandidates = [
         prod.priceFormatted,
         prod.formattedPrice,
         prod.priceDisplay,
         prod.defaultDisplayedPrice,
      ];

      for (const candidate of priceCandidates) {
         if (typeof candidate === "string" && candidate.trim()) {
            return candidate;
         }
      }

      const numericCandidates = [
         prod.priceAmount,
         prod.price_value,
         prod.priceValue,
         prod.price,
      ];

      for (const candidate of numericCandidates) {
         if (candidate === null || candidate === undefined) continue;
         const value = typeof candidate === "number" ? candidate : Number(candidate);
         if (Number.isFinite(value)) {
            const currency =
               prod.currency ||
               prod.currencyCode ||
               prod.priceCurrency ||
               prod.price?.currency ||
               "EUR";
            try {
               return new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: String(currency).toUpperCase(),
               }).format(value);
            } catch {
               return `${value.toFixed(2)} ${currency}`;
            }
         }
      }

      return null;
   }, [prod]);

   if (loading) return <p className="text-sm text-zinc-500">Chargement…</p>;
   if (err) return <p className="text-sm text-zinc-500">Erreur : {err}</p>;
   if (!prod) return <p className="text-sm text-zinc-500">Produit introuvable.</p>;

   const handleAddToCart = () => {
      if (!prod) return;
      addItem(prod, quantity);
      setFeedback("Produit ajouté au panier !");
      setTimeout(() => setFeedback(""), 2500);
   };

   const handleQuantityChange = event => {
      const next = Number(event.target.value);
      if (!Number.isFinite(next)) return;
      setQuantity(Math.max(1, Math.min(99, Math.floor(next))));
   };

   const image =
      prod.externalPreviewUrl || prod.externalThumbnailUrl || prod.previewUrl || null;

   return (
      <section className="container py-10">
         <div className="grid gap-8 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
               {image ? (
                  <img
                     className="h-full w-full object-cover"
                     src={`${API}/api/proxy/image?url=${encodeURIComponent(image)}`}
                     alt={prod.title}
                  />
               ) : (
                  <div className="flex h-80 items-center justify-center text-sm text-zinc-500">Pas d’image</div>
               )}
            </div>

            <div className="space-y-6">
               <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  La réserve de la Panda Cycling
               </p>
               <h1 className="text-3xl font-bold leading-tight text-white">{prod.title}</h1>
               <div className="text-sm text-zinc-400">Status : {prod.status}</div>
               {displayPrice && <div className="text-lg font-semibold text-white">{displayPrice}</div>}

               {prod.description && (
                  <div
                     className="prose border-t border-neutral-800 pt-6"
                     dangerouslySetInnerHTML={{ __html: prod.description }}
                  />
               )}

               <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label className="flex w-full items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-2 text-sm text-zinc-300 sm:w-auto">
                     <span>Quantité</span>
                     <input
                        type="number"
                        min="1"
                        max="99"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-16 rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm text-white"
                     />
                  </label>
                  <button className="btn btn-primary w-full sm:w-auto" onClick={handleAddToCart}>
                     Ajouter au panier
                  </button>
                  <Link className="btn btn-ghost w-full sm:w-auto hover:border-neutral-500" to="/catalog">
                     Retour au catalogue
                  </Link>
               </div>

               {feedback && <p className="text-sm font-medium text-zinc-300">{feedback}</p>}

               {Array.isArray(prod.productVariantOptions) && prod.productVariantOptions.length > 0 && (
                  <div className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
                     <h3 className="text-lg font-semibold text-white">Options</h3>
                     <ul className="space-y-2 pl-4 text-sm text-zinc-300">
                        {prod.productVariantOptions.map(opt => (
                           <li key={opt.name}>
                              <strong>{opt.name}:</strong> {opt.values.join(", ")}
                           </li>
                        ))}
                     </ul>
                  </div>
               )}
            </div>
         </div>
      </section>
   );
}
