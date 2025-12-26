/**
 * Affiche le podium (top 3)
 * @param {Object} props
 * @param {import('../../types').KomEntry[]} props.entries - Les 3 premiers
 */
function Podium({ entries }) {
  const podiumOrder = [1, 0, 2]; // 2e, 1er, 3e (affichage classique podium)
  const heights = ["h-16", "h-20", "h-12"];
  const colors = [
    "bg-gradient-to-t from-zinc-400 to-zinc-300", // Argent
    "bg-gradient-to-t from-amber-500 to-yellow-400", // Or
    "bg-gradient-to-t from-amber-700 to-amber-600", // Bronze
  ];

  return (
    <div className="flex items-end justify-center gap-2 mb-6">
      {podiumOrder.map((index, position) => {
        const entry = entries[index];
        if (!entry) return null;

        return (
          <div key={entry.rank} className="flex flex-col items-center gap-2">
            <div className="text-center">
              <p className="text-sm font-semibold text-white">{entry.athleteName}</p>
              <p className="text-xs text-panda-400">{entry.time}</p>
            </div>
            <div
              className={`${heights[position]} w-16 ${colors[position]} rounded-t-lg flex items-center justify-center`}
            >
              <span className="text-lg font-bold text-neutral-900">{entry.rank}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

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

/**
 * Carte pour afficher le KOM du mois
 * @param {Object} props
 * @param {import('../../types').KomMonthly} props.kom - Données du KOM
 * @param {boolean} [props.showFullLeaderboard=false] - Afficher le classement complet
 */
export default function KomCard({ kom, showFullLeaderboard = false }) {
  const top3 = kom.leaderboard.slice(0, 3);
  const rest = showFullLeaderboard ? kom.leaderboard.slice(3) : [];

  return (
    <article className="glass-panel p-6">
      <header className="text-center mb-6">
        <p className="text-sm text-panda-400 uppercase tracking-wider mb-1">
          KOM du mois
        </p>
        <h3 className="text-xl font-bold text-white mb-2">{formatMonth(kom.month)}</h3>
        <a
          href={kom.segmentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-bamboo-400 hover:text-bamboo-300 transition"
        >
          {kom.segmentName}
        </a>
        <div className="flex items-center justify-center gap-4 mt-2 text-xs text-panda-500">
          <span>{(kom.segmentDistance / 1000).toFixed(1)} km</span>
          <span>{kom.segmentElevation} m D+</span>
        </div>
      </header>

      <Podium entries={top3} />

      {rest.length > 0 && (
        <div className="border-t border-panda-700/30 pt-4 mt-4">
          <ul className="space-y-2">
            {rest.map((entry) => (
              <li
                key={entry.rank}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-panda-500 text-right">{entry.rank}.</span>
                  <span className="text-panda-200">{entry.athleteName}</span>
                </div>
                <span className="text-panda-400">{entry.time}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <footer className="mt-6 text-center">
        <a
          href={kom.segmentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost text-sm"
        >
          Voir sur Strava
        </a>
      </footer>
    </article>
  );
}
