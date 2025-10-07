import { Link } from "react-router-dom";
import heroImg from "../assets/hero.png";

export default function Home() {
  return (
    <section className="container py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            La réserve de la Panda Cycling
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Moins de watt, plus de classe.
          </h1>
          <p className="text-lg leading-relaxed text-zinc-400">
            Les accessoires secrets de ceux qui ont déjà rangé le vélo — mais pas le style.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/catalog" className="btn btn-primary">
              Voir le catalogue
            </Link>
            <Link to="/a-propos" className="btn btn-ghost">
              À propos
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 shadow-lg">
          <div className="overflow-hidden">
            <img className="h-full w-full object-cover" src={heroImg} alt="Beanies minimalistes" />
          </div>
          <div className="flex items-center justify-between border-t border-neutral-800 px-4 py-3 text-sm text-zinc-400">
            <span>Bonnet noir — broderie blanche</span>
            <span className="text-zinc-500">Clean. Warm. Ride-ready.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
