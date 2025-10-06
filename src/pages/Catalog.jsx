import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { API } from "../lib/api.js";

export default function Catalog() {
   const [items, setItems] = useState([]);
   const [loading, setLoading] = useState(true);
   const [err, setErr] = useState("");

   useEffect(() => {
      let live = true;
      fetch(`${API}/api/catalog/featured`)
         .then(r => r.json())
         .then(json => {
            if (!live) return;
            setItems(json.items || []);
            setLoading(false);
         })
         .catch(e => {
            if (!live) return;
            setErr(e.message);
            setLoading(false);
         });
      return () => { live = false; };
   }, []);

   if (loading) return <p className="muted">Chargement du catalogue…</p>;
   if (err) return <p className="error">Erreur : {err}</p>;
   if (!items.length) return <p>Aucun produit pour l’instant.</p>;

   return (
      <section>
         <h1>Catalogue</h1>
         <p className="muted">Clique sur un produit pour voir le détail.</p>
         <div className="grid">
            {items.map(p => <ProductCard key={p.id} product={p} />)}
         </div>
      </section>
   );
}
