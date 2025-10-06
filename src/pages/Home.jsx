import { Link } from "react-router-dom";
import heroImg from '../assets/hero.png';


export default function Home() {
   return (
      <section className="hero">
         <div className="hero-copy">
            <p className="kicker">La réserve de la Panda Cycling</p>
            <h1>Moins de watt, plus de classe.</h1>
            <p className="lead">
               Les accessoires secrets de ceux qui ont déjà rangé le vélo — mais pas le style.
            </p>
            <div className="cta">
               <Link to="/catalog" className="btn btn-primary">Voir le catalogue</Link>
               <Link to="/a-propos" className="btn btn-ghost">À propos</Link>
            </div>
         </div>
         <div className="hero-card">
            <div className="hero-media">
               {/* Remplace par ta propre image */}
               <img
                  src={heroImg}
                  alt="Beanies minimalistes"
               />
            </div>
            <div className="caption">
               <span>Bonnet noir — broderie blanche</span>
               <span className="muted">Clean. Warm. Ride-ready.</span>
            </div>
         </div>
      </section>
   );
}
