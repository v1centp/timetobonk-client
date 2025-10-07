import { Link } from "react-router-dom";
import { API } from "../lib/api.js";

export default function ProductCard({ product }) {
   const { id, title, image, status } = product;
   return (
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/60 transition hover:border-neutral-600">
         {image && (
            <img
               className="h-56 w-full object-cover"
               src={`${API}/api/proxy/image?url=${encodeURIComponent(image)}`}
               alt={title}
            />
         )}
         <div className="space-y-3 p-5">
            <h3 className="text-lg font-semibold text-white leading-snug">{title}</h3>
            <p className="text-sm text-zinc-400">Status: {status}</p>
            <div className="flex justify-end">
               <Link className="btn btn-ghost hover:border-neutral-500" to={`/catalog/${id}`}>
                  Voir le détail
               </Link>
            </div>
         </div>
      </article>
   );
}
