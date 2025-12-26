import { Link } from "react-router-dom";

const VALUES = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Convivialité",
    description: "Avant tout, on roule pour le plaisir d'être ensemble. L'ambiance prime sur la performance.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Progression",
    description: "Chacun avance à son rythme. On s'encourage, on partage nos conseils, on grandit ensemble.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Aventure",
    description: "Explorer de nouvelles routes, découvrir des coins cachés, sortir de sa zone de confort.",
  },
];

export default function About() {
  return (
    <div className="container">
      {/* En-tête */}
      <header className="text-center max-w-3xl mx-auto mb-16">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-panda-500 mb-4">
          Notre histoire
        </p>
        <h1 className="text-4xl font-bold text-white mb-6">À propos du club</h1>
        <p className="text-lg leading-relaxed text-panda-400">
          Communauté de cyclistes amateurs basée à Lausanne.
          Tous niveaux bienvenus. Sorties hebdomadaires sur Zwift l'hiver, sur route dès la belle saison.
        </p>
      </header>

      {/* L'histoire */}
      <section className="grid gap-8 lg:grid-cols-2 mb-16">
        <article className="glass-panel p-8">
          <h2 className="text-xl font-semibold text-white mb-4">Comment tout a commencé</h2>
          <div className="space-y-4 text-panda-400">
            <p>
              Tout est parti d'une poignée d'amis qui se retrouvaient le dimanche matin
              pour rouler ensemble. Pas de pression, pas d'objectifs de performance —
              juste le plaisir de pédaler, de discuter, et de finir autour d'un café.
            </p>
            <p>
              Petit à petit, le groupe s'est agrandi. Des amis d'amis nous ont rejoints,
              puis des inconnus croisés sur Strava. Aujourd'hui, Panda Cycling rassemble
              une communauté diverse : débutants curieux, cyclistes aguerris, gravel addicts,
              et même quelques anciens pros.
            </p>
          </div>
        </article>

        <article className="glass-panel p-8">
          <h2 className="text-xl font-semibold text-white mb-4">Notre programme</h2>
          <div className="space-y-4 text-panda-400">
            <ul className="space-y-3">
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
          </div>
        </article>
      </section>

      {/* Valeurs */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white text-center mb-10">Nos valeurs</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {VALUES.map((value) => (
            <article key={value.title} className="glass-panel p-6 text-center">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-panda-700/50 text-white mb-4">
                {value.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
              <p className="text-sm text-panda-400">{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Rejoindre */}
      <section className="glass-panel p-8 md:p-12 mb-16">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Join us !</h2>
            <div className="space-y-4 text-panda-400">
              <p>
                Envie de rouler avec nous ? C'est simple : contacte-nous sur WhatsApp
                ou Instagram, et viens faire une sortie d'essai. Pas besoin de matériel
                de pro, juste un vélo qui roule et l'envie de partager un bon moment.
              </p>
              <p>
                La première sortie est gratuite et sans engagement. Si tu te sens bien
                dans le groupe, tu peux ensuite devenir membre et participer à toutes
                nos activités.
              </p>
              <p className="text-sm text-panda-500 italic">
                Psst, spread the word : ajoute un 🐼 à ton nom sur Strava pour agrandir la communauté !
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <a
                href="https://chat.whatsapp.com/H1RW0OpgOfH7TXJ8OKGA0n"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Nous contacter
              </a>
              <Link to="/sorties" className="btn-ghost">
                Voir les sorties
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-panel p-4 flex items-center gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bamboo-500/20 text-bamboo-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <div>
                <p className="font-medium text-white">Première sortie gratuite</p>
                <p className="text-sm text-panda-500">Viens tester sans engagement</p>
              </div>
            </div>

            <div className="glass-panel p-4 flex items-center gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bamboo-500/20 text-bamboo-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <div>
                <p className="font-medium text-white">Tous niveaux acceptés</p>
                <p className="text-sm text-panda-500">Du débutant au confirmé</p>
              </div>
            </div>

            <div className="glass-panel p-4 flex items-center gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bamboo-500/20 text-bamboo-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <div>
                <p className="font-medium text-white">Ambiance conviviale</p>
                <p className="text-sm text-panda-500">L'entraide avant la compétition</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Le shop */}
      <section className="text-center">
        <div className="glass-panel p-8">
          <h2 className="text-xl font-semibold text-white mb-3">Soutenir le club</h2>
          <p className="text-panda-400 max-w-xl mx-auto mb-6">
            Notre shop propose des articles aux couleurs du club : maillots, chaussettes,
            gourdes et plus encore. Les bénéfices financent nos activités et événements.
          </p>
          <Link to="/catalog" className="btn-primary">
            Découvrir le shop
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
