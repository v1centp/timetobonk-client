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
              Il y a fort longtemps, dit-on, un petit panda serait tombé par hasard sur un hangar abandonné.
              À l'intérieur, des vélos oubliés, couverts de poussière, mais encore pleins de promesses.
              Il en aurait choisi un, sans vraiment savoir pourquoi.
              Et ce jour-là, quelque chose aurait commencé.
            </p>
            <p>
              Très vite, d'autres l'auraient rejoint.
              Des amis, attirés par la route, le mouvement, l'envie d'aller voir plus loin.
              Ensemble, ils auraient roulé sans plan, traversé des vallées, gravi des cols,
              parcouru le monde entier — juste pour le plaisir d'avancer… ou pour un KOM.
            </p>
            <p>
              Est-ce que tout ça est vrai ?
              Personne ne peut vraiment le dire.
              Peut-être que c'est une histoire qu'on se raconte.
              Peut-être qu'elle a grandi avec le temps.
            </p>
            <p className="text-white font-medium italic border-l-2 border-bamboo-500 pl-4">
              Mais une chose est sûre : la légende continue de rouler.
              Et aujourd'hui encore, le Panda Cycling Club avance, fidèle à cet esprit —
              libre, infatigable, et souvent pleine balle.
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
