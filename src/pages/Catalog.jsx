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

   if (loading) return <p className="text-sm text-zinc-500">Chargement du catalogue…</p>;
   if (err) return <p className="text-sm text-zinc-500">Erreur : {err}</p>;
   if (!items.length) return <p className="text-sm text-zinc-500">Aucun produit pour l’instant.</p>;

   return (
      <section className="container space-y-4 py-10">
         <div className="space-y-2">
            <h1 className="text-3xl font-bold">Catalogue</h1>
            <p className="text-sm text-zinc-400">Clique sur un produit pour voir le détail.</p>
         </div>
         <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {items.map(p => <ProductCard key={p.id} product={p} />)}
         </div>
      </section>
   );
}
