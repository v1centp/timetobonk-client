import { useCurrentKom, useKomHistory } from "../hooks";
import { KomCard } from "../components/cards";

/**
 * Formate le mois en français
 * @param {string} monthStr - Format "YYYY-MM"
 * @returns {string}
 */
function formatMonth(monthStr) {
  const [year, month] = monthStr.split("-");
  const date = new Date(year, parseInt(month) - 1);
  return date.toLocaleDateString("fr-CH", { month: "long", year: "numeric" });
}

export default function Kom() {
  const { kom, loading: loadingCurrent, error: errorCurrent } = useCurrentKom();
  const { history, loading: loadingHistory } = useKomHistory();

  const loading = loadingCurrent || loadingHistory;

  return (
    <div className="container">
      {/* En-tête */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">KOM du mois</h1>
        <p className="text-panda-400 max-w-2xl mx-auto">
          Chaque mois, un segment Strava est mis à l'honneur. Qui sera le plus rapide ?
        </p>
      </header>

      {/* État de chargement */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-panda-700 border-t-white" />
        </div>
      )}

      {/* Erreur */}
      {errorCurrent && (
        <div className="glass-panel p-6 text-center">
          <p className="text-red-400">{errorCurrent}</p>
        </div>
      )}

      {/* KOM actuel */}
      {!loading && !errorCurrent && (
        <div className="max-w-xl mx-auto mb-12">
          {kom ? (
            <KomCard kom={kom} showFullLeaderboard />
          ) : (
            <div className="glass-panel p-8 text-center">
              <p className="text-panda-400">Rien pour l'instant.</p>
            </div>
          )}
        </div>
      )}

      {/* Explication */}
      <section className="glass-panel p-6 mb-12 max-w-2xl mx-auto">
        <h2 className="text-lg font-semibold text-white mb-3">Comment participer ?</h2>
        <ol className="list-decimal list-inside space-y-2 text-panda-400 text-sm">
          <li>Rejoignez notre club Strava</li>
          <li>Réalisez le segment du mois et enregistrez votre activité</li>
          <li>Votre temps sera automatiquement classé</li>
          <li>Le classement est mis à jour chaque semaine</li>
        </ol>
        <div className="mt-4">
          <a
            href="https://www.strava.com/clubs/pandacycling"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Rejoindre le club Strava
          </a>
        </div>
      </section>

      {/* Historique */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-6 text-center">
          Mois précédents
        </h2>

        {history.length === 0 ? (
          <div className="glass-panel p-8 text-center max-w-2xl mx-auto">
            <p className="text-panda-400">Rien à montrer pour l'instant.</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto">
            {history.map((item) => (
              <article
                key={item.id}
                className="glass-panel p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <h3 className="font-medium text-white">{formatMonth(item.month)}</h3>
                  <a
                    href={item.segmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-bamboo-400 hover:text-bamboo-300"
                  >
                    {item.segmentName}
                  </a>
                </div>

                <div className="flex items-center gap-4">
                  {item.leaderboard.slice(0, 3).map((entry, index) => (
                    <div key={entry.rank} className="text-center">
                      <span
                        className={`text-xs ${
                          index === 0
                            ? "text-amber-400"
                            : index === 1
                            ? "text-panda-300"
                            : "text-amber-600"
                        }`}
                      >
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </span>
                      <p className="text-sm text-panda-300">{entry.athleteName}</p>
                      <p className="text-xs text-panda-500">{entry.time}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
