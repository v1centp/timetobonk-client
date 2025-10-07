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
   const [selectedVariant, setSelectedVariant] = useState(null);
   const [mainImageUrl, setMainImageUrl] = useState(null);
   const { addItem } = useCart();

   useEffect(() => {
      let live = true;
      fetch(`${API}/api/catalog/product/${id}`)
         .then((r) => {
            if (!r.ok) throw new Error("Produit introuvable");
            return r.json();
         })
         .then((json) => {
            if (!live) return;
            setProd(json);
            const variants = Array.isArray(json.variants) ? json.variants : [];
            const first = variants.find(v => v.connectionStatus === "connected") || variants[0] || null;
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
      return () => { live = false; };
   }, [id]);

   const handleQuantityChange = (e) => {
      const n = Number(e.target.value);
      if (!Number.isFinite(n)) return;
      setQuantity(Math.max(1, Math.min(99, Math.floor(n))));
   };

   const handlePickVariant = (v) => {
      setSelectedVariant(v);
      const img = v?.imageUrl || v?.fileUrl;
      if (img) setMainImageUrl(img);
   };

   const handleAddToCart = () => {
      if (!prod || !selectedVariant?.productUid) return alert("Variante indisponible");
      addItem(
         {
            id: prod.id,
            title: `${prod.title}${selectedVariant?.title ? ` — ${selectedVariant.title}` : ""}`,
            productUid: selectedVariant.productUid,
            image: mainImageUrl,
         },
         quantity
      );
      setFeedback("Produit ajouté au panier !");
      setTimeout(() => setFeedback(""), 2000);
   };

   const gallery = useMemo(() => {
      if (!prod?.productImages) return [];
      return prod.productImages.map((img) => ({
         id: img.id,
         fileUrl: img.fileUrl,
         variantIds: img.productVariantIds ?? [],
      }));
   }, [prod]);

   const imageUrl = (url) => url ? `${API}/api/proxy/image?url=${encodeURIComponent(url)}` : null;

   if (loading) return <p className="text-sm text-zinc-500">Chargement…</p>;
   if (err) return <p className="text-sm text-zinc-500">Erreur : {err}</p>;
   if (!prod) return <p className="text-sm text-zinc-500">Produit introuvable.</p>;

   const mainImg = imageUrl(mainImageUrl);

   return (
      <section className="container py-10">
         <div className="grid gap-10 lg:grid-cols-2">
            {/* Bloc gauche : image + miniatures */}
            <div className="space-y-3">
               <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
                  {mainImg ? (
                     <img
                        src={mainImg}
                        alt={prod.title}
                        className="h-[400px] w-full object-contain bg-neutral-900"
                     />
                  ) : (
                     <div className="flex h-[400px] items-center justify-center text-sm text-zinc-500">
                        Pas d’image
                     </div>
                  )}
               </div>

               {gallery.length > 1 && (
                  <div className="flex flex-wrap gap-3 justify-center">
                     {gallery.map((img) => {
                        const url = imageUrl(img.fileUrl);
                        const isActive = mainImageUrl && img.fileUrl === mainImageUrl;
                        return (
                           <button
                              key={img.id}
                              type="button"
                              onClick={() => setMainImageUrl(img.fileUrl)}
                              className={`h-[70px] w-[70px] overflow-hidden rounded-md border ${isActive ? "border-white" : "border-neutral-700"} bg-neutral-900`}
                           >
                              {url && (
                                 <img
                                    src={url}
                                    alt=""
                                    className="h-full w-full object-cover"
                                 />
                              )}
                           </button>
                        );
                     })}
                  </div>
               )}
            </div>

            {/* Bloc droite : infos produit */}
            <div className="space-y-5">
               <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  La réserve de la Panda Cycling
               </p>
               <h1 className="text-3xl font-bold text-white">{prod.title}</h1>
               <div className="text-sm text-zinc-400">Status : {prod.status}</div>

               {Array.isArray(prod.variants) && prod.variants.length > 0 && (
                  <div className="space-y-2">
                     <p className="text-sm text-zinc-300">
                        Couleur :
                        <span className="font-medium text-white">
                           {" "}
                           {selectedVariant?.title || "—"}
                        </span>
                     </p>
                     <div className="flex flex-wrap gap-2">
                        {prod.variants
                           .filter((v) => v.connectionStatus === "connected")
                           .map((v) => {
                              const img = gallery.find((g) =>
                                 Array.isArray(g.variantIds) && g.variantIds.includes(v.id)
                              );
                              const url = imageUrl(img?.fileUrl) || mainImg;
                              const active = selectedVariant?.id === v.id;
                              return (
                                 <button
                                    key={v.id}
                                    type="button"
                                    onClick={() => handlePickVariant(v)}
                                    className={`h-[60px] w-[60px] overflow-hidden rounded-md border ${active ? "border-white" : "border-neutral-700"}`}
                                 >
                                    <img
                                       src={url}
                                       alt={v.title}
                                       className="h-full w-full object-cover"
                                    />
                                 </button>
                              );
                           })}
                     </div>
                  </div>
               )}

               <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-2 text-sm text-zinc-300">
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
                  <button
                     className="btn btn-primary w-full sm:w-auto"
                     onClick={handleAddToCart}
                  >
                     Ajouter au panier
                  </button>
                  <Link
                     className="btn btn-ghost w-full sm:w-auto hover:border-neutral-500"
                     to="/catalog"
                  >
                     Retour
                  </Link>
               </div>

               {feedback && (
                  <p className="text-sm font-medium text-zinc-300">{feedback}</p>
               )}

               {prod.description && (
                  <div
                     className="prose border-t border-neutral-800 pt-4 max-w-prose"
                     dangerouslySetInnerHTML={{ __html: prod.description }}
                  />
               )}
            </div>
         </div>
      </section>
   );
}
