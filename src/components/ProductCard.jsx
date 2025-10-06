import { Link } from "react-router-dom";
import { API } from "../lib/api.js";

export default function ProductCard({ product }) {
   const { id, title, image, status } = product;
   return (
      <article className="card">
         {image && (
            <img
               className="card-img"
               src={`${API}/api/proxy/image?url=${encodeURIComponent(image)}`}
               alt={title}
            />
         )}
         <div className="card-body">
            <h3 className="card-title">{title}</h3>
            <p className="muted small">Status: {status}</p>
            <div className="card-actions">
               <Link className="btn btn-ghost" to={`/catalog/${id}`}>Voir le détail</Link>
            </div>
         </div>
      </article>
   );
}
