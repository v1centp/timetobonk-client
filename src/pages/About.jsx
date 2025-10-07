import { Link } from "react-router-dom";

export default function About() {
  return (
    <section className="container space-y-12">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Manifesto</p>
        <h1 className="text-4xl font-semibold text-white">À propos</h1>
        <p className="max-w-3xl text-base leading-relaxed text-zinc-300">
          🐼 <strong>L’histoire de la Panda Cycling</strong>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="glass-panel space-y-4 p-6">
          <p className="text-base leading-relaxed text-zinc-300">
            On raconte qu’il est né seul, sans jamais avoir connu ses parents. Dans les bois, il a grandi entre curiosité et
            silence, apprenant à se débrouiller comme il pouvait. Il a trouvé la chaleur ailleurs : dans les rires des animaux
            qu’il croisait, dans les chemins sans destination, dans le bruit du vent plutôt que celui du monde.
          </p>
          <p className="text-base leading-relaxed text-zinc-300">
            Un jour, en longeant la mer, il découvrit un vieux bateau échoué. Dans son épave dormaient des objets étranges : des
            vélos, rouillés mais encore debout. Avec ses amis, il en prit un, juste pour voir jusqu’où on pouvait aller. Ils se
            mirent à rouler, d’abord pour s’amuser, puis pour chercher — sans trop savoir quoi. Peut-être une famille, peut-être
            simplement un sens à tout ça. Et quelque part, ils le trouvèrent, en pédalant.
          </p>
        </article>

        <article className="glass-panel space-y-4 p-6">
          <p className="text-base leading-relaxed text-zinc-300">
            Les années passèrent, les routes changèrent, mais la légende resta. Depuis, les réserves du panda se sont nourries de
            souvenirs de voyage : des bonnets, des bidons, des objets simples qu’il collectionne et partage. Certaines de ces
            trouvailles sont réunies ici, sur ce site — pour ceux qui savent que rouler n’est qu’une partie de l’histoire.
          </p>
          <p className="text-base leading-relaxed text-zinc-300">
            Chaque pièce porte un peu de cette aventure. Et à ceux qui les emportent, le panda ne demande qu’une chose :
            <strong> en prendre soin, et continuer la route.</strong>
          </p>
          <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-neutral-900/60 px-4 py-3 text-sm text-zinc-400">
            <span className="inline-flex h-2 w-2 rounded-full bg-white/40" aria-hidden="true" />
            Design en Suisse. Production à la demande.
          </div>
        </article>
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-neutral-900/60 p-6 text-sm text-zinc-300 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-zinc-400">
          <span className="inline-flex h-2 w-2 rounded-full bg-white/40" aria-hidden="true" />
          <span>Envie de rejoindre la réserve ?</span>
        </div>
        <Link to="/catalog" className="btn-primary w-full sm:w-auto">
          Explorer le catalogue
        </Link>
      </div>
    </section>
  );
}
