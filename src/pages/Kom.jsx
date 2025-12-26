import { useCurrentKom } from "../hooks";
import { KomCard } from "../components/cards";

export default function Kom() {
  const { kom, loading, error } = useCurrentKom();

  return (
    <div className="container">
      {/* En-tête */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Segment du mois</h1>
        <p className="text-panda-400 max-w-2xl mx-auto">
          Chaque mois, un segment Strava est mis à l'honneur. À toi de jouer !
        </p>
      </header>

      {/* État de chargement */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-panda-700 border-t-white" />
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="glass-panel p-6 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* KOM actuel */}
      {!loading && !error && (
        <div className="max-w-xl mx-auto mb-12">
          {kom ? (
            <KomCard kom={kom} />
          ) : (
            <div className="glass-panel p-8 text-center">
              <p className="text-panda-400">Rien pour l'instant.</p>
            </div>
          )}
        </div>
      )}

      {/* Explication */}
      <section className="glass-panel p-6 max-w-2xl mx-auto">
        <h2 className="text-lg font-semibold text-white mb-3">Comment participer ?</h2>
        <ol className="list-decimal list-inside space-y-2 text-panda-400 text-sm">
          <li>Rejoignez notre club Strava</li>
          <li>Réalisez le segment du mois et enregistrez votre activité</li>
          <li>Comparez vos temps avec les autres membres du club</li>
        </ol>
        <div className="mt-4">
          <a
            href="https://www.strava.com/clubs/panda-cycling"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Rejoindre le club Strava
          </a>
        </div>
      </section>
    </div>
  );
}
