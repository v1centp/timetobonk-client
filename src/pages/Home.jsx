import { Link } from "react-router-dom";
import heroImg from "../assets/hero.png";

const FEATURES = [
  {
    title: "Sélection pointue",
    description: "Des pièces choisies pour leur minimalisme et leur durabilité.",
  },
  {
    title: "Variantes soignées",
    description: "Chaque produit est proposé avec des visuels clairs pour choisir facilement.",
  },
  {
    title: "Expédition maîtrisée",
    description: "Paiement sécurisé via Stripe et production à la demande.",
  },
];

export default function Home() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-x-0 -top-16 -z-10 h-[420px] bg-gradient-to-b from-white/10 via-white/0 to-transparent blur-3xl" />
      <div className="container py-16 sm:py-24">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-neutral-900/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-zinc-300">
              <span>Nouveautés</span>
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-white/60" />
              <span>Réserve 2024</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                Moins de watt, plus de classe.
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-zinc-400">
                Les accessoires secrets de ceux qui ont déjà rangé le vélo — mais pas le style. Découvre une sélection ultra
                épurée, pensée pour les escapades comme pour les jours off.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/catalog" className="btn-primary">
                Voir le catalogue
                <span aria-hidden="true">↗</span>
              </Link>
              <Link to="/a-propos" className="btn-ghost">
                L’histoire de la réserve
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="glass-panel group relative overflow-hidden p-5 transition hover:-translate-y-1 hover:border-white/20 hover:bg-neutral-900/80"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_70%)] opacity-0 transition duration-300 group-hover:opacity-100" />
                  <div className="relative space-y-2">
                    <h2 className="text-sm font-semibold text-white">{feature.title}</h2>
                    <p className="text-sm text-zinc-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 translate-x-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_65%)] blur-3xl" />
            <article className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-neutral-900/60 shadow-soft">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_70%)] opacity-0 transition duration-500 group-hover:opacity-100" />
              <div className="relative overflow-hidden">
                <img className="h-full w-full object-cover" src={heroImg} alt="Beanies minimalistes" />
              </div>
              <div className="relative border-t border-white/10 bg-neutral-900/60 px-6 py-5 text-sm text-zinc-300">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-white/60" aria-hidden="true" />
                    <span className="font-medium text-white">Bonnet noir — broderie blanche</span>
                  </div>
                  <Link
                    to="/catalog"
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400 transition hover:text-white"
                  >
                    Voir les variantes
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 rounded-3xl border border-white/10 bg-neutral-900/60 px-6 py-5 text-sm text-zinc-300 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-zinc-400">
            <span className="inline-flex h-2 w-2 rounded-full bg-white/40" aria-hidden="true" />
            <span>Production à la demande, expédiée depuis la Suisse.</span>
          </div>
          <Link to="/catalog" className="inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-zinc-200">
            Explorer la réserve complète
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
