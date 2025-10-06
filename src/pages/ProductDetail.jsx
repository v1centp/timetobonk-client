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

   if (loading) return <p className="muted">Chargement…</p>;
   if (err) return <p className="error">Erreur : {err}</p>;
   if (!prod) return <p>Produit introuvable.</p>;

   const image =
      prod.externalPreviewUrl || prod.externalThumbnailUrl || prod.previewUrl || null;

   return (
      <section className="detail">
         <div className="detail-media">
            {image ? (
               <img src={`${API}/api/proxy/image?url=${encodeURIComponent(image)}`} alt={prod.title} />
            ) : (
               <div className="placeholder">Pas d’image</div>
            )}
         </div>
         <div className="detail-info">
            <p className="kicker">La réserve de la Panda Cycling</p>
            <h1>{prod.title}</h1>
            <div className="muted small">Status : {prod.status}</div>

            {prod.description && (
               <div className="desc" dangerouslySetInnerHTML={{ __html: prod.description }} />
            )}

            <div className="cta">
               <button className="btn btn-primary">Ajouter au panier</button>
               <Link className="btn btn-ghost" to="/catalog">Retour au catalogue</Link>
            </div>

            {Array.isArray(prod.productVariantOptions) && prod.productVariantOptions.length > 0 && (
               <div className="options">
                  <h3>Options</h3>
                  <ul>
                     {prod.productVariantOptions.map(opt => (
                        <li key={opt.name}>
                           <strong>{opt.name}:</strong> {opt.values.join(", ")}
                        </li>
                     ))}
                  </ul>
               </div>
            )}
         </div>
      </section>
   );
}
