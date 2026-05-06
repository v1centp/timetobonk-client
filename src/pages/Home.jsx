import { Link } from "react-router-dom";
import { SocialLinks } from "../components/social";
import { StravaStats } from "../components/strava";
import logoHero from "../assets/logohero.png";

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Gradient décoratif */}
      <div className="absolute inset-x-0 -top-16 -z-10 h-[520px] bg-gradient-to-b from-bamboo-500/5 via-transparent to-transparent blur-3xl" />

      {/* Hero Section */}
      <section className="container py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Texte */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-3 rounded-full border border-panda-700/50 bg-panda-900/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-panda-300 mb-8">
              <span className="h-2 w-2 rounded-full bg-bamboo-400 animate-pulse" />
              <span>Club de vélo</span>
            </div>

            <h1 className="text-balance text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl mb-6">
              Panda Cycling
            </h1>

            <p className="text-xl leading-relaxed text-panda-400 mb-4">
              Communauté de cyclistes amateurs basée à Lausanne.
            </p>
            <p className="text-lg text-panda-400 mb-8">
              Tous niveaux bienvenus. Sorties hebdomadaires sur Zwift l'hiver, sur route dès la belle saison.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
              <Link to="/sorties" className="btn-primary">
                Voir les sorties
                <span aria-hidden="true">→</span>
              </Link>
              <SocialLinks showLabels={false} size="sm" />
            </div>
          </div>

          {/* Logo Hero */}
          <div className="relative order-first lg:order-last">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-bamboo-500/10 blur-3xl" />
            </div>
            <div className="relative mx-auto lg:mx-0 w-64 h-[16rem] sm:w-80 sm:h-[20rem] lg:w-96 lg:h-[24rem]">
              <img
                src={logoHero}
                alt="Panda Cycling"
                className="w-full h-full object-cover rounded-3xl shadow-2xl border border-panda-700/30 object-[center_65%]"
                style={{ filter: "drop-shadow(0 0 40px rgba(34, 197, 94, 0.1))" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Strava */}
      <section className="container py-12">
        <div className="max-w-3xl">
          <header className="mb-6">
            <h2 className="text-xl font-bold text-white mb-1">Le club en chiffres</h2>
            <p className="text-sm text-panda-400">Activité récente sur Strava</p>
          </header>
          <StravaStats />
        </div>
      </section>

      {/* Rejoindre le club */}
      <section className="container py-12">
        <div className="glass-panel p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Join us !</h2>
          <p className="text-panda-400 max-w-xl mx-auto mb-6">
            Contacte-nous sur WhatsApp ou Instagram pour plus d'infos.
            Gratuit et sans engagement !
          </p>
          <p className="text-sm text-panda-500 mb-8">
            Psst, spread the word : ajoute un 🐼 à ton nom sur Strava pour agrandir la communauté !
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
            <Link to="/catalog" className="btn-ghost">
              Voir le shop
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
