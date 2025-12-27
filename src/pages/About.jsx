export default function About() {
  return (
    <div className="container">
      {/* En-tête */}
      <header className="text-center max-w-3xl mx-auto mb-16">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-panda-500 mb-4">
          Notre histoire
        </p>
        <h1 className="text-4xl font-bold text-white mb-6">À propos</h1>
      </header>

      {/* La légende du Panda */}
      <section className="mb-16">
        <article className="glass-panel p-8 md:p-10 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">🐼</span>
            <h2 className="text-2xl font-bold text-white">La légende du Panda</h2>
          </div>
          <div className="space-y-5 text-panda-300 leading-relaxed">
            <p>
              On raconte qu'il est né seul, sans jamais avoir connu ses parents.
              Dans les forêts, il a grandi entre curiosité et silence, apprenant à se débrouiller comme il pouvait.
              Il a trouvé la chaleur ailleurs : dans les rires des animaux qu'il croisait,
              dans les chemins sans destination, dans le bruit du vent plutôt que celui du monde.
            </p>
            <p>
              Un jour, en longeant un lac, il découvrit un vieux hangar abandonné.
              À l'intérieur dormaient des objets étranges : des vélos, rouillés mais encore debout.
              Avec ses amis, il en prit un, juste pour voir jusqu'où on pouvait aller.
              Ils se mirent à rouler, d'abord pour s'amuser, puis pour chercher — sans trop savoir quoi.
              Peut-être une famille, peut-être simplement un sens à tout ça.
              Et quelque part entre les cols et les descentes, ils le trouvèrent.
            </p>
            <p>
              Les années passèrent, les routes changèrent, mais la légende resta.
              Depuis, les réserves du panda se sont nourries de souvenirs de voyage :
              des maillots, des bidons, des objets simples qu'il collectionne et partage.
              Certaines de ces trouvailles sont réunies ici — pour ceux qui savent
              que rouler n'est qu'une partie de l'histoire.
            </p>
            <p className="text-white font-medium italic border-l-2 border-bamboo-500 pl-4">
              Chaque pièce porte un peu de cette aventure.
              Et à ceux qui les emportent, le panda ne demande qu'une chose :
              en prendre soin, et continuer la route.
            </p>
          </div>
        </article>
      </section>

      {/* Notre programme */}
      <section className="max-w-4xl mx-auto">
        <article className="glass-panel p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Notre programme</h2>
          <ul className="space-y-4 text-panda-400">
            <li>
              <strong className="text-white">Mercredi soir</strong> — Course "pleine balle" sur Zwift l'hiver, sur route dès la belle saison
            </li>
            <li>
              <strong className="text-white">Vendredi 5h30</strong> — Sortie tranquille sur Zwift, no drop (on ne lâche personne)
            </li>
            <li>
              <strong className="text-white">Weekends</strong> — Sorties aventure (cols, tours hors Lausanne) annoncées ~1 mois à l'avance
            </li>
          </ul>
        </article>
      </section>
    </div>
  );
}
