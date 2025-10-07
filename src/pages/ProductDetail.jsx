import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API } from "../lib/api.js";

export default function ProductDetail() {
   const { id } = useParams();
   const [prod, setProd] = useState(null);
   const [loading, setLoading] = useState(true);
   const [err, setErr] = useState("");

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

   if (loading) return <p className="text-sm text-zinc-500">Chargement…</p>;
   if (err) return <p className="text-sm text-zinc-500">Erreur : {err}</p>;
   if (!prod) return <p className="text-sm text-zinc-500">Produit introuvable.</p>;

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

               {prod.description && (
                  <div
                     className="prose border-t border-neutral-800 pt-6"
                     dangerouslySetInnerHTML={{ __html: prod.description }}
                  />
               )}

               <div className="flex flex-col gap-3 sm:flex-row">
                  <button className="btn btn-primary w-full sm:w-auto">Ajouter au panier</button>
                  <Link className="btn btn-ghost w-full sm:w-auto hover:border-neutral-500" to="/catalog">
                     Retour au catalogue
                  </Link>
               </div>

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
