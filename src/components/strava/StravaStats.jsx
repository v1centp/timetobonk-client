import { useStravaClub } from "../../hooks";

/**
 * Formate une distance en km
 * @param {number} meters
 * @returns {string}
 */
function formatDistance(km) {
  if (km >= 1000) {
    return `${(km / 1000).toFixed(1)}k`;
  }
  return `${km}`;
}

/**
 * Formate un temps en heures/minutes
 * @param {number} seconds
 * @returns {string}
 */
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h${minutes.toString().padStart(2, "0")}`;
  }
  return `${minutes}min`;
}

/**
 * Affiche les stats du club Strava
 */
export default function StravaStats() {
  const { stats, activities, loading, error } = useStravaClub();

  if (loading) {
    return (
      <div className="glass-panel p-6">
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-panda-700 border-t-bamboo-400" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <svg className="h-5 w-5 text-[#FC4C02]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
          </svg>
          <span className="font-semibold text-white">Strava</span>
        </div>
        <p className="text-sm text-panda-400 mb-4">
          Rejoins notre club pour voir les stats !
        </p>
        <a
          href="https://www.strava.com/clubs/panda-cycling"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost text-sm w-full justify-center"
        >
          Rejoindre le club sur Strava
        </a>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <svg className="h-5 w-5 text-[#FC4C02]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
          </svg>
          <span className="font-semibold text-white">Stats du club</span>
        </div>
        <span className="text-xs text-panda-500">30 derniers jours</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {formatDistance(stats.totalDistance)}
          </div>
          <div className="text-xs text-panda-400">km</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {formatDistance(stats.totalElevation)}
          </div>
          <div className="text-xs text-panda-400">m D+</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {stats.totalActivities}
          </div>
          <div className="text-xs text-panda-400">sorties</div>
        </div>
      </div>

      {/* Dernières activités */}
      {activities.length > 0 && (
        <div className="border-t border-panda-700/30 pt-4">
          <h4 className="text-xs font-medium text-panda-400 uppercase tracking-wider mb-3">
            Dernières sorties
          </h4>
          <ul className="space-y-2">
            {activities.slice(0, 5).map((activity, index) => (
              <li
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-panda-200 truncate">{activity.athlete}</span>
                </div>
                <div className="flex items-center gap-3 text-panda-400 shrink-0">
                  <span>{Math.round(activity.distance / 1000)} km</span>
                  <span className="text-panda-600">·</span>
                  <span>{formatTime(activity.movingTime)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Lien */}
      <div className="mt-4 pt-4 border-t border-panda-700/30">
        <a
          href="https://www.strava.com/clubs/panda-cycling"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost text-sm w-full justify-center"
        >
          Voir sur Strava
        </a>
      </div>
    </div>
  );
}
